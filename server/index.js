import "dotenv/config";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import mongoose from "mongoose";
import { z } from "zod";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = Number(process.env.PORT) || 3001;
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, "..");
const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS
    ?? (process.env.NODE_ENV === "production"
      ? ""
      : "http://localhost:8080,http://127.0.0.1:8080"))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

mongoose.set("bufferCommands", false);
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://checkout.razorpay.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      fontSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      frameSrc: ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: null,
    },
  },
}));
app.use((req, res, next) => {
  const origin = req.get("origin");
  const requestOrigin = `${req.protocol}://${req.get("host")}`;
  if (!origin || origin === requestOrigin) {
    next();
    return;
  }
  if (!allowedOrigins.has(origin)) {
    res.status(403).json({ error: "This website is not allowed to use the API." });
    return;
  }

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(204);
    return;
  }
  next();
});
app.post(
  "/api/webhooks/razorpay",
  express.raw({ type: "application/json", limit: "20kb" }),
  asyncRoute(async (req, res) => {
    if (!Buffer.isBuffer(req.body)) {
      res.status(400).json({ error: "Invalid webhook payload." });
      return;
    }
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      res.status(503).json({ error: "Payment notifications are not configured." });
      return;
    }

    const signature = req.get("x-razorpay-signature") ?? "";
    const expected = createHmac("sha256", webhookSecret).update(req.body).digest();
    let provided;
    try {
      provided = Buffer.from(signature, "hex");
    } catch {
      provided = Buffer.alloc(0);
    }
    if (provided.length !== expected.length || !timingSafeEqual(expected, provided)) {
      res.status(400).json({ error: "Invalid webhook signature." });
      return;
    }

    let event;
    try {
      event = JSON.parse(req.body.toString("utf8"));
    } catch {
      res.status(400).json({ error: "Invalid webhook payload." });
      return;
    }
    if (!event || typeof event !== "object") {
      res.status(400).json({ error: "Invalid webhook payload." });
      return;
    }

    if (event.event === "payment.captured" || event.event === "order.paid") {
      const payment = event.payload?.payment?.entity;
      if (!payment || typeof payment.order_id !== "string" || typeof payment.id !== "string") {
        res.status(400).json({ error: "Invalid payment notification." });
        return;
      }

      const donation = await DonationIntent.findOne({ razorpayOrderId: payment.order_id });
      if (!donation) {
        res.status(500).json({ error: "Donation order not found." });
        return;
      }
      if (payment.status !== "captured" || payment.amount !== donation.amountInr * 100
        || payment.currency !== "INR") {
        res.status(400).json({ error: "Payment details do not match the donation." });
        return;
      }
      if (donation.paymentStatus === "paid") {
        res.json({ received: true });
        return;
      }
      await DonationIntent.updateOne(
        { _id: donation._id, paymentStatus: "pending" },
        { $set: { paymentStatus: "paid", razorpayPaymentId: payment.id } },
      );
    }

    res.json({ received: true });
  }),
);
app.use(express.json({ limit: "20kb" }));

const submissionLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many submissions. Please try again later." },
});
const verificationLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many verification requests. Please try again later." },
});

const ContactSubmission = mongoose.model(
  "ContactSubmission",
  new mongoose.Schema(
    {
      firstName: { type: String, required: true, maxlength: 80 },
      lastName: { type: String, required: true, maxlength: 80 },
      email: { type: String, required: true, maxlength: 254 },
      phone: { type: String, maxlength: 40 },
      subject: { type: String, required: true, enum: ["id-card", "volunteer", "donation", "partnership", "support", "other"] },
      message: { type: String, required: true, maxlength: 5000 },
    },
    { timestamps: true, strict: "throw" },
  ),
);

const VolunteerApplication = mongoose.model(
  "VolunteerApplication",
  new mongoose.Schema(
    {
      firstName: { type: String, required: true, maxlength: 80 },
      lastName: { type: String, required: true, maxlength: 80 },
      email: { type: String, required: true, maxlength: 254 },
      phone: { type: String, required: true, maxlength: 40 },
      availability: { type: String, required: true, enum: ["weekdays", "weekends", "both", "flexible"] },
      interests: {
        type: [{ type: String, enum: ["outreach", "support", "admin", "mobile"] }],
        default: [],
        validate: (values) => values.length <= 4,
      },
      experience: { type: String, maxlength: 3000, default: "" },
      motivation: { type: String, required: true, maxlength: 3000 },
    },
    { timestamps: true, strict: "throw" },
  ),
);

const DonationIntent = mongoose.model(
  "DonationIntent",
  new mongoose.Schema(
    {
      amountInr: { type: Number, required: true, min: 100, max: 10000000 },
      frequency: { type: String, required: true, enum: ["one-time", "monthly"] },
      anonymous: { type: Boolean, default: false },
      firstName: { type: String, maxlength: 80 },
      lastName: { type: String, maxlength: 80 },
      email: { type: String, maxlength: 254 },
      phone: { type: String, maxlength: 40 },
      paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
      razorpayOrderId: { type: String, unique: true, sparse: true },
      razorpayPaymentId: { type: String, unique: true, sparse: true },
    },
    { timestamps: true, strict: "throw" },
  ),
);

const IDCardRecord = mongoose.model(
  "IDCardRecord",
  new mongoose.Schema(
    {
      idNumber: { type: String, required: true, unique: true },
      name: { type: String, required: true, maxlength: 120 },
      fatherName: { type: String, required: true, maxlength: 120 },
      dateOfBirth: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
      phone: { type: String, maxlength: 40, default: "" },
      email: { type: String, maxlength: 254, default: "" },
      city: { type: String, required: true, maxlength: 100 },
      state: { type: String, required: true, maxlength: 100 },
      country: { type: String, required: true, maxlength: 100 },
      pincode: { type: String, maxlength: 20, default: "" },
      status: { type: String, enum: ["active", "revoked"], default: "active" },
      consentVersion: { type: String, required: true, enum: ["id-card-storage-v1"] },
      consentAt: { type: Date, required: true },
      publicNameConsentAccepted: { type: Boolean, default: false },
      publicNameConsentVersion: { type: String, enum: ["public-masked-name-v1"] },
      publicNameConsentAt: { type: Date },
    },
    { timestamps: true, strict: "throw" },
  ),
);

const commonName = z.string().trim().min(1).max(80);
const emailAddress = z.string().trim().email().max(254).transform((value) => value.toLowerCase());
const optionalPhone = z.string().trim().max(40).optional().default("");

const contactSchema = z.object({
  firstName: commonName,
  lastName: commonName,
  email: emailAddress,
  phone: optionalPhone,
  subject: z.enum(["id-card", "volunteer", "donation", "partnership", "support", "other"]),
  message: z.string().trim().min(1).max(5000),
}).strict();

const volunteerSchema = z.object({
  firstName: commonName,
  lastName: commonName,
  email: emailAddress,
  phone: z.string().trim().min(1).max(40),
  availability: z.enum(["weekdays", "weekends", "both", "flexible"]),
  interests: z.array(z.enum(["outreach", "support", "admin", "mobile"])).max(4).default([]),
  experience: z.string().trim().max(3000).optional().default(""),
  motivation: z.string().trim().min(1).max(3000),
}).strict();

const donationSchema = z.object({
  amountInr: z.number().int().min(100).max(10000000),
  frequency: z.literal("one-time"),
  anonymous: z.boolean().default(false),
  firstName: z.string().trim().max(80).optional().default(""),
  lastName: z.string().trim().max(80).optional().default(""),
  email: z.union([z.literal(""), z.string().trim().email().max(254)]).optional().default(""),
  phone: optionalPhone,
}).strict().transform((data) => {
  if (data.anonymous) {
    return { amountInr: data.amountInr, frequency: data.frequency, anonymous: true };
  }
  return { ...data, email: data.email.toLowerCase() };
});

const donationVerificationSchema = z.object({
  donationId: z.string().regex(/^[a-f\d]{24}$/i),
  razorpay_order_id: z.string().min(1).max(100),
  razorpay_payment_id: z.string().min(1).max(100),
  razorpay_signature: z.string().regex(/^[a-f\d]{64}$/i),
}).strict();

const idCardSchema = z.object({
  name: z.string().trim().min(1).max(120),
  fatherName: z.string().trim().min(1).max(120),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  phone: z.string().trim().max(40).optional().default(""),
  email: z.union([z.literal(""), z.string().trim().email().max(254)]).optional().default(""),
  city: z.string().trim().min(1).max(100),
  state: z.string().trim().min(1).max(100),
  country: z.string().trim().min(1).max(100),
  pincode: z.string().trim().max(20).optional().default(""),
  consentAccepted: z.literal(true),
  publicNameConsentAccepted: z.literal(true),
}).strict();

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function validateBody(schema, req, res) {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Please check the submitted information and try again.",
      fields: parsed.error.issues.map(({ path: fieldPath, message }) => ({
        field: fieldPath.join("."),
        message,
      })),
    });
    return null;
  }
  return parsed.data;
}

app.get("/api/health", (_req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? "ok" : "unavailable",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

app.post("/api/contact", submissionLimit, asyncRoute(async (req, res) => {
  const data = validateBody(contactSchema, req, res);
  if (!data) return;
  await ContactSubmission.create(data);
  res.status(201).json({ message: "Your message has been received." });
}));

app.post("/api/volunteer", submissionLimit, asyncRoute(async (req, res) => {
  const data = validateBody(volunteerSchema, req, res);
  if (!data) return;
  await VolunteerApplication.create(data);
  res.status(201).json({ message: "Your volunteer application has been received." });
}));

app.get("/api/donations/status", (_req, res) => {
  const configured = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
  res.json({ checkoutAvailable: configured });
});

app.post("/api/donations", submissionLimit, asyncRoute(async (req, res) => {
  const data = validateBody(donationSchema, req, res);
  if (!data) return;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    res.status(503).json({ error: "Online donations are not available yet. Please contact us for other ways to give." });
    return;
  }

  const donation = await DonationIntent.create({
    amountInr: data.amountInr,
    frequency: data.frequency,
    anonymous: data.anonymous,
  });
  let gatewayResponse;
  try {
    gatewayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: data.amountInr * 100,
        currency: "INR",
        receipt: donation._id.toString(),
      }),
      signal: AbortSignal.timeout(10000),
    });
  } catch (error) {
    await DonationIntent.updateOne({ _id: donation._id }, { $set: { paymentStatus: "failed" } });
    console.error("Razorpay order request failed:", error?.name ?? "UnknownError");
    res.status(502).json({ error: "Could not connect to the payment provider. Please try again." });
    return;
  }

  let order;
  try {
    order = await gatewayResponse.json();
  } catch {
    order = null;
  }
  if (!gatewayResponse.ok || typeof order?.id !== "string") {
    await DonationIntent.updateOne({ _id: donation._id }, { $set: { paymentStatus: "failed" } });
    console.error("Razorpay order request was rejected:", gatewayResponse.status);
    res.status(502).json({ error: "The payment provider could not start checkout. Please try again." });
    return;
  }

  await DonationIntent.updateOne(
    { _id: donation._id },
    { $set: { razorpayOrderId: order.id } },
  );
  res.status(201).json({
    donationId: donation._id.toString(),
    orderId: order.id,
    keyId,
    amount: data.amountInr * 100,
    currency: "INR",
  });
}));

app.post("/api/donations/verify", submissionLimit, asyncRoute(async (req, res) => {
  const data = validateBody(donationVerificationSchema, req, res);
  if (!data) return;

  const donation = await DonationIntent.findById(data.donationId);
  if (!donation || donation.razorpayOrderId !== data.razorpay_order_id) {
    res.status(404).json({ error: "Donation checkout could not be found." });
    return;
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    res.status(503).json({ error: "Payment verification is unavailable. Please contact support." });
    return;
  }
  const expected = createHmac("sha256", secret)
    .update(`${donation.razorpayOrderId}|${data.razorpay_payment_id}`)
    .digest();
  const provided = Buffer.from(data.razorpay_signature, "hex");
  if (provided.length !== expected.length || !timingSafeEqual(expected, provided)) {
    res.status(400).json({ error: "The payment could not be verified. Please contact support if you were charged." });
    return;
  }

  if (donation.paymentStatus === "paid") {
    if (donation.razorpayPaymentId !== data.razorpay_payment_id) {
      res.status(409).json({ error: "This checkout has already been completed." });
      return;
    }
    res.json({ paid: true });
    return;
  }

  if (donation.paymentStatus !== "pending") {
    res.status(409).json({ error: "This donation checkout is no longer active. Please start a new donation." });
    return;
  }

  const paymentResponse = await fetch(
    `https://api.razorpay.com/v1/payments/${encodeURIComponent(data.razorpay_payment_id)}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${secret}`).toString("base64")}`,
      },
      signal: AbortSignal.timeout(10000),
    },
  );
  let payment;
  try {
    payment = await paymentResponse.json();
  } catch {
    payment = null;
  }
  if (!paymentResponse.ok || payment?.id !== data.razorpay_payment_id
    || payment?.order_id !== donation.razorpayOrderId
    || payment?.amount !== donation.amountInr * 100 || payment?.currency !== "INR"
    || payment?.status !== "captured") {
    res.status(409).json({ error: "The payment is not confirmed as captured yet. Please try again shortly." });
    return;
  }

  const updated = await DonationIntent.findOneAndUpdate(
    { _id: donation._id, paymentStatus: "pending" },
    { $set: { paymentStatus: "paid", razorpayPaymentId: data.razorpay_payment_id } },
    { new: true },
  );
  if (!updated) {
    const latest = await DonationIntent.findById(donation._id).select("paymentStatus razorpayPaymentId");
    if (latest?.paymentStatus === "paid" && latest.razorpayPaymentId === data.razorpay_payment_id) {
      res.json({ paid: true });
      return;
    }
    res.status(409).json({ error: "This donation checkout is no longer active. Please contact support." });
    return;
  }

  res.json({ paid: true });
}));

app.post("/api/id-cards", submissionLimit, asyncRoute(async (req, res) => {
  const data = validateBody(idCardSchema, req, res);
  if (!data) return;

  const cardDetails = {
    name: data.name,
    fatherName: data.fatherName,
    dateOfBirth: data.dateOfBirth,
    phone: data.phone,
    email: data.email,
    city: data.city,
    state: data.state,
    country: data.country,
    pincode: data.pincode,
  };
  const idNumber = `IDF${randomBytes(8).toString("hex").toUpperCase()}`;
  const record = await IDCardRecord.create({
    ...cardDetails,
    email: cardDetails.email.toLowerCase(),
    idNumber,
    consentVersion: "id-card-storage-v1",
    consentAt: new Date(),
    publicNameConsentAccepted: true,
    publicNameConsentVersion: "public-masked-name-v1",
    publicNameConsentAt: new Date(),
  });

  res.status(201).json({ idNumber: record.idNumber, issuedAt: record.createdAt });
}));

app.get("/api/verify/:idNumber", verificationLimit, asyncRoute(async (req, res) => {
  const idNumber = req.params.idNumber.toUpperCase();
  if (!/^IDF[A-F0-9]{16}$/.test(idNumber)) {
    res.json({ valid: false });
    return;
  }

  const record = await IDCardRecord.findOne({ idNumber, status: "active" })
    .select("name createdAt publicNameConsentAccepted")
    .lean();
  if (!record) {
    res.json({ valid: false });
    return;
  }

  const maskedName = record.publicNameConsentAccepted
    ? record.name
      .split(/\s+/)
      .map((part) => {
        const characters = Array.from(part);
        return `${characters[0]}${"*".repeat(Math.max(1, Math.min(characters.length - 1, 8)))}`;
      })
      .join(" ")
    : undefined;

  res.json({ valid: true, ...(maskedName ? { maskedName } : {}), issuedAt: record.createdAt });
}));

app.get("/api/admin/id-cards/:idNumber", asyncRoute(async (req, res) => {
  const expected = Buffer.from(process.env.ADMIN_API_TOKEN ?? "");
  const authorization = req.get("authorization") ?? "";
  const bearerToken = /^Bearer\s+(.+)$/i.exec(authorization)?.[1] ?? "";
  const provided = Buffer.from(bearerToken);
  const authorized = expected.length > 0
    && expected.length === provided.length
    && timingSafeEqual(expected, provided);
  if (!authorized) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }

  const idNumber = req.params.idNumber.toUpperCase();
  if (!/^IDF[A-F0-9]{16}$/.test(idNumber)) {
    res.status(404).json({ error: "ID card not found." });
    return;
  }

  const record = await IDCardRecord.findOne({ idNumber }).select("-__v").lean();
  if (!record) {
    res.status(404).json({ error: "ID card not found." });
    return;
  }

  res.json({ record });
}));

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API endpoint not found." });
});

const staticDirectory = path.join(projectRoot, "dist");
app.use(express.static(staticDirectory, { index: false }));
app.get("*", (_req, res, next) => {
  res.sendFile(path.join(staticDirectory, "index.html"), (error) => {
    if (error) next(error);
  });
});

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    res.status(400).json({ error: "Request body must be valid JSON." });
    return;
  }
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.StrictModeError) {
    res.status(400).json({ error: "The submitted information is invalid." });
    return;
  }
  if (error?.type === "entity.too.large") {
    res.status(413).json({ error: "The submitted information is too large." });
    return;
  }
  console.error("API request failed:", error?.name ?? "UnknownError");
  res.status(500).json({ error: "Unable to process your request right now." });
});

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is required. Add your MongoDB Atlas connection string to the environment.");
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, "0.0.0.0", () => {
    console.log(`IdentityFirst server listening on port ${port}`);
  });
} catch {
  console.error("Could not connect to MongoDB. Verify MONGODB_URI and Atlas network access.");
  process.exit(1);
}
