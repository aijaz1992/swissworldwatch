// UPI details decoded from the PhonePe "Scan & Pay" QR in /public/payments/upi-qr.png.
// If the QR is ever replaced, update these values to match it.
export const UPI_ID = "aijazqazi786@ibl";
export const UPI_PAYEE = "AIJAZ AHMAD GULZAR AHMAD QAZI";
export const UPI_QR_IMAGE = "/payments/upi-qr.png";
export const UPI_QR_FULL_IMAGE = "/payments/upi-qr-phonepe.png";

/** Deep link that opens the customer's UPI app with the payee and amount pre-filled (mobile only). */
export function upiPayLink(amountInr: number, note?: string) {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: UPI_PAYEE,
    am: amountInr.toFixed(2),
    cu: "INR",
  });
  if (note) params.set("tn", note);
  return `upi://pay?${params.toString().replace(/\+/g, "%20")}`;
}

export const UPI_REFERENCE_PATTERN = /^[A-Za-z0-9]{8,30}$/;

export function paymentMethodLabel(method: string) {
  switch (method) {
    case "UPI":
      return "UPI (scan & pay)";
    case "PREPAID":
      return "Prepaid";
    default:
      return "Cash on delivery";
  }
}
