interface ApiErrorResponse {
  error?: string;
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");

export async function postSubmission<TResponse>(
  path: string,
  payload: unknown,
): Promise<TResponse> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/api/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Cannot reach the server. Please try again later.");
  }

  let result: TResponse & ApiErrorResponse;
  try {
    result = await response.json() as TResponse & ApiErrorResponse;
  } catch {
    throw new Error("The server returned an invalid response. Please try again later.");
  }
  if (!response.ok) {
    throw new Error(result.error || "The request could not be completed.");
  }

  return result;
}

export async function verifyIDCard(
  idNumber: string,
): Promise<{ valid: boolean; maskedName?: string; issuedAt?: string }> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/api/verify/${encodeURIComponent(idNumber)}`);
  } catch {
    throw new Error("Cannot reach the verification service. Please try again later.");
  }

  let result: { valid: boolean; maskedName?: string; issuedAt?: string; error?: string };
  try {
    result = await response.json();
  } catch {
    throw new Error("The verification service returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(result.error || "Verification could not be completed.");
  }
  return result;
}

export async function getDonationCheckoutStatus(): Promise<{ checkoutAvailable: boolean }> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}/api/donations/status`);
  } catch {
    throw new Error("Cannot reach the donation service.");
  }

  let result: { checkoutAvailable?: boolean; error?: string };
  try {
    result = await response.json();
  } catch {
    throw new Error("The donation service returned an invalid response.");
  }

  if (!response.ok || typeof result.checkoutAvailable !== "boolean") {
    throw new Error(result.error || "Could not check donation availability.");
  }
  return { checkoutAvailable: result.checkoutAvailable };
}

export async function verifyDonationPayment(payload: {
  donationId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<{ paid: boolean }> {
  return postSubmission<{ paid: boolean }>("donations/verify", payload);
}
