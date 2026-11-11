import { useEffect, useState, type FormEvent } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, FileText, Shield, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { getDonationCheckoutStatus, postSubmission, verifyDonationPayment } from "@/lib/api";
import { Link } from "react-router-dom";

type RazorpayPaymentResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme: { color: string };
  handler: (response: RazorpayPaymentResponse) => void;
  modal: { ondismiss: () => void };
};

type RazorpayCheckout = {
  open: () => void;
  on: (event: "payment.failed", handler: (response: { error?: { description?: string } }) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayCheckout;
  }
}

let checkoutScriptPromise: Promise<void> | null = null;

function loadRazorpayCheckout(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  if (!checkoutScriptPromise) {
    checkoutScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        if (window.Razorpay) {
          resolve();
        } else {
          checkoutScriptPromise = null;
          reject(new Error("Razorpay checkout did not initialize. Please try again."));
        }
      };
      script.onerror = () => {
        checkoutScriptPromise = null;
        reject(new Error("Could not load Razorpay checkout. Please try again."));
      };
      document.body.appendChild(script);
    });
  }
  return checkoutScriptPromise;
}

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState("500");
  const [customAmount, setCustomAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutAvailable, setCheckoutAvailable] = useState<boolean | null>(null);
  const [completedAmount, setCompletedAmount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    getDonationCheckoutStatus()
      .then(({ checkoutAvailable: available }) => {
        if (active) setCheckoutAvailable(available);
      })
      .catch(() => {
        if (active) setCheckoutAvailable(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleDonation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const amountInr = Number(customAmount || selectedAmount);

    if (!Number.isInteger(amountInr) || amountInr < 100 || amountInr > 10000000) {
      toast.error("Enter a whole-number donation amount between ₹100 and ₹10,000,000.");
      return;
    }

    if (checkoutAvailable !== true) {
      toast.error("Online donations are not available yet. Please contact us for other ways to give.");
      return;
    }

    const anonymous = formData.get("anonymous") === "on";
    const firstName = anonymous ? "" : String(formData.get("firstName") || "");
    const lastName = anonymous ? "" : String(formData.get("lastName") || "");
    const email = anonymous ? "" : String(formData.get("email") || "");
    const phone = anonymous ? "" : String(formData.get("phone") || "");

    setIsSubmitting(true);
    setCompletedAmount(null);
    try {
      await loadRazorpayCheckout();
      const checkout = await postSubmission<{
        donationId: string;
        orderId: string;
        keyId: string;
        amount: number;
        currency: string;
      }>("donations", {
        amountInr,
        frequency: "one-time",
        anonymous,
        firstName,
        lastName,
        email,
        phone,
      });

      if (!window.Razorpay) throw new Error("Razorpay checkout did not load. Please try again.");
      const donorName = `${firstName} ${lastName}`.trim();
      const razorpay = new window.Razorpay({
        key: checkout.keyId,
        amount: checkout.amount,
        currency: checkout.currency,
        name: "IdentityFirst",
        description: "One-time donation",
        order_id: checkout.orderId,
        prefill: anonymous ? undefined : { name: donorName, email, contact: phone },
        theme: { color: "#166534" },
        handler: async (payment) => {
          try {
            const result = await verifyDonationPayment({
              donationId: checkout.donationId,
              ...payment,
            });
            if (!result.paid) throw new Error("Payment has not been confirmed yet.");
            setCompletedAmount(amountInr);
            toast.success("Your donation payment has been confirmed. Thank you!");
            form.reset();
            setSelectedAmount("500");
            setCustomAmount("");
          } catch (error) {
            toast.error(error instanceof Error
              ? `${error.message} If you were charged, please contact us.`
              : "We could not confirm the payment. If you were charged, please contact us.");
          }
        },
        modal: {
          ondismiss: () => {
            toast.info("Checkout closed. Check Razorpay's confirmation if you completed a payment.");
          },
        },
      });
      razorpay.on("payment.failed", ({ error }) => {
        toast.error(error?.description || "Razorpay could not complete the payment. Contact us if your bank shows a charge.");
      });
      razorpay.open();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start the donation checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const impactItems = [
    {
      icon: FileText,
      amount: "₹500",
      impact: "Can help cover ID card materials and registration costs"
    },
    {
      icon: Users,
      amount: "₹1,000",
      impact: "Can contribute to outreach and application assistance"
    },
    {
      icon: Shield,
      amount: "₹2,500",
      impact: "Can help fund secure registration equipment"
    },
    {
      icon: Heart,
      amount: "₹5,000",
      impact: "Can contribute to mobile outreach costs"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-hero text-primary-foreground py-16 lg:py-24">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Make a <span className="text-accent">Difference</span> Today
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
              Your contribution supports dignified identity access and outreach for people who need it.
              Every contribution helps sustain this work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="yellow" size="lg" className="text-lg px-8">
                <a href="#donation-form">Donate Now</a>
              </Button>
              <Button asChild variant="yellow-outline" size="lg" className="text-lg px-8">
                <a href="#impact">Learn About Impact</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="scroll-mt-20 py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Your Impact</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Explore some of the ways a contribution can support identity access and outreach
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {impactItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                      <CardTitle className="text-2xl font-bold text-accent">
                        {item.amount}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.impact}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              These examples are illustrative, not fixed allocations; actual costs and use of funds may vary.
            </p>
          </div>
        </section>

        {/* Donation Form */}
        <section id="donation-form" className="scroll-mt-20 py-16 lg:py-24 bg-secondary/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl text-center">Make a Donation</CardTitle>
                    <p className="text-muted-foreground text-center">
                      Choose a one-time amount. Payments are securely handled by Razorpay.
                    </p>
                  </CardHeader>
                  <CardContent>
                    {completedAmount !== null && (
                      <div className="mb-6 flex items-start gap-3 rounded-md border border-primary/30 bg-primary/5 p-4" role="status">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                        <div>
                          <p className="font-semibold">Thank you for your donation of ₹{completedAmount.toLocaleString("en-IN")}.</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Your payment was confirmed. Keep the confirmation from Razorpay; contact us if you need assistance.
                          </p>
                        </div>
                      </div>
                    )}
                    <form onSubmit={handleDonation} className="space-y-6">
                    {/* Quick Amount Buttons */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">Quick Amounts</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["₹500", "₹1,000", "₹2,500", "₹5,000"].map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            variant={selectedAmount === amount.replace(/[^\d]/g, "") && !customAmount ? "default" : "outline"}
                            onClick={() => {
                              setSelectedAmount(amount.replace(/[^\d]/g, ""));
                              setCustomAmount("");
                            }}
                            aria-pressed={selectedAmount === amount.replace(/[^\d]/g, "") && !customAmount}
                            className="h-12 text-lg font-semibold hover:bg-primary hover:text-primary-foreground"
                          >
                            {amount}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="customAmount">Custom Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                        <Input
                          id="customAmount"
                          type="number"
                          placeholder="Minimum ₹100"
                          className="pl-8"
                          min="100"
                          max="10000000"
                          step="1"
                          value={customAmount}
                          onChange={(event) => setCustomAmount(event.target.value)}
                        />
                      </div>
                    </div>

                    {/* Donor Information */}
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Optional details are used to prefill Razorpay checkout and are not stored in our donation record.
                        Razorpay may request information needed to process payment.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="donorFirstName">First Name</Label>
                          <Input id="donorFirstName" name="firstName" autoComplete="given-name" maxLength={80} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="donorLastName">Last Name</Label>
                          <Input id="donorLastName" name="lastName" autoComplete="family-name" maxLength={80} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="donorEmail">Email Address</Label>
                        <Input id="donorEmail" name="email" type="email" autoComplete="email" maxLength={254} placeholder="Optional" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="donorPhone">Phone Number (Optional)</Label>
                        <Input id="donorPhone" name="phone" type="tel" autoComplete="tel" maxLength={40} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="anonymous" />
                        <span className="text-sm">I want to remain anonymous</span>
                      </label>
                      <p className="text-sm text-muted-foreground">
                        When selected, we will not prefill your name or contact details in Razorpay checkout.
                      </p>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || checkoutAvailable !== true}>
                      {isSubmitting
                        ? "Opening secure checkout..."
                        : checkoutAvailable === null
                          ? "Checking payment availability..."
                          : checkoutAvailable
                            ? "Donate with Razorpay"
                            : "Online donations unavailable"}
                    </Button>
                    {checkoutAvailable === false ? (
                      <p className="text-sm text-muted-foreground" role="status">
                        Online donations are temporarily unavailable. Please <Link to="/contact" className="underline underline-offset-4">contact us</Link> for other ways to support.
                      </p>
                    ) : (
                      <p className="text-xs text-center text-muted-foreground">
                        You will complete payment in Razorpay checkout. We do not collect or store card details.
                      </p>
                    )}
                    </form>
                  </CardContent>
                </Card>

                <div className="space-y-8">
                  {/* Payment Methods */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Payment Processing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Payments are made through Razorpay’s checkout. We store the donation amount and payment reference to confirm the transaction. Contact details are not stored in our donation record; payment credentials are handled by Razorpay.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Security & Trust */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Security & Trust</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Shield className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Provider-handled checkout</p>
                          <p className="text-xs text-muted-foreground">Payment details are entered in Razorpay, not stored on this site.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <FileText className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Donation confirmation</p>
                          <p className="text-xs text-muted-foreground">Payment status is confirmed by the server before it is marked paid.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Heart className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Questions about your gift?</p>
                          <p className="text-xs text-muted-foreground"><Link to="/contact" className="underline underline-offset-4">Contact our team</Link> for assistance.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Other Ways to Help */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Other Ways to Help</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link to="/volunteer">
                          Volunteer Your Time
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link to="/contact">
                          Corporate Partnership
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={async () => {
                          const pageUrl = window.location.href;
                          try {
                            if (navigator.share) {
                              await navigator.share({
                                title: "Support IdentityFirst",
                                text: "Help support dignified access to identity and essential services.",
                                url: pageUrl,
                              });
                            } else {
                              await navigator.clipboard.writeText(pageUrl);
                              toast.success("Donation page link copied.");
                            }
                          } catch (error) {
                            if (error instanceof Error && error.name !== "AbortError") {
                              toast.error("Could not share the donation page.");
                            }
                          }
                        }}
                      >
                        Spread Awareness
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Thank You Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold mb-4">Thank You for Your Generosity</h3>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Every donation brings us closer to a world where everyone has access to identification 
              and the dignity that comes with it. Together, we're making a real difference.
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Donate;
