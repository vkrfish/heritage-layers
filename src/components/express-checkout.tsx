import * as Dialog from "@radix-ui/react-dialog";
import { X, ShieldCheck, Smartphone, CheckCircle, ArrowRight, CreditCard, Sparkles, Loader2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui-kit";
import { formatPrice } from "@/lib/products";
import { placeOrder } from "@/lib/db";

type ExpressCheckoutProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
  variantLabel?: string;
  price?: number;
  qty?: number;
};

export function ExpressCheckoutModal({
  open,
  onOpenChange,
  productName = "Classic Putharekulu",
  variantLabel = "500g (12 pcs)",
  price = 649,
  qty = 1,
}: ExpressCheckoutProps) {
  const [step, setStep] = React.useState<"mobile" | "otp" | "payment" | "success">("mobile");
  const [phone, setPhone] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState<"upi" | "card" | "cod">("upi");
  const [upiId, setUpiId] = React.useState("");
  const [confirmedOrderId, setConfirmedOrderId] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const totalAmount = price * qty;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setStep("otp");
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const result = await placeOrder({
      customerName: "Express Customer",
      customerPhone: phone,
      address: "Express Checkout Delivery",
      city: "Express",
      items: [
        {
          slug,
          name: productName,
          variant: variantLabel,
          price,
          qty,
        },
      ],
      subtotal: totalAmount,
      shipping: 0,
      total: totalAmount,
      paymentMethod: paymentMethod === "upi" ? "UPI" : paymentMethod === "card" ? "Card" : "COD",
      status: "Pending",
    });

    setIsSubmitting(false);
    setConfirmedOrderId(result.orderId || `ORD-9S-${Math.floor(10000 + Math.random() * 90000)}`);
    setStep("success");
  };

  const handleReset = () => {
    setStep("mobile");
    setPhone("");
    setOtp("");
    setConfirmedOrderId("");
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-brown/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-xl border border-brown/20 bg-cream p-6 shadow-lift duration-200 data-[state=open]:animate-in data-[state=open]:zoom-in-95 sm:p-8">
          <div className="flex items-center justify-between border-b border-brown/15 pb-4">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gold/30 text-brown font-sans font-bold text-sm">⚡</span>
              <div>
                <Dialog.Title className="font-display text-2xl text-brown leading-tight">
                  Express Checkout
                </Dialog.Title>
                <p className="font-sans text-xs font-bold text-brown/70">Fast, secure &amp; encrypted purchase</p>
              </div>
            </div>
            <Dialog.Close aria-label="Close modal" className="rounded-full p-2 text-brown/70 hover:bg-cream-light hover:text-brown focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          {/* Item Summary Bar */}
          <div className="mt-4 flex items-center justify-between rounded-lg border border-gold/40 bg-gold/15 p-3.5 border-l-4 border-l-gold">
            <div>
              <p className="font-sans text-sm font-bold text-brown">{productName}</p>
              <p className="font-sans text-xs font-bold text-brown/70">{variantLabel} × {qty}</p>
            </div>
            <div className="text-right">
              <p className="font-sans text-xs font-bold text-brown/70">Total</p>
              <p className="font-sans text-base font-bold text-terracotta">{formatPrice(totalAmount)}</p>
            </div>
          </div>

          {step === "mobile" && (
            <form onSubmit={handleSendOtp} className="mt-6 space-y-4 font-sans font-bold">
              <div>
                <label className="block font-sans text-xs font-bold text-brown mb-1">
                  Mobile Number (for instant OTP login)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-sm text-brown/70">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="98765 43210"
                    className="w-full rounded-lg border border-brown/30 bg-cream-light py-2.5 pl-12 pr-4 font-sans text-base font-bold text-brown placeholder:text-brown/40 focus:border-terracotta focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-lg bg-green/10 p-3 text-xs text-green flex items-center gap-2 border-l-4 border-l-green">
                <ShieldCheck className="h-4 w-4 text-green shrink-0" />
                <span>We'll auto-fetch your saved address via secure mobile OTP.</span>
              </div>

              <Button type="submit" variant="primary" className="w-full justify-center gap-2 mt-2 bg-brown text-white hover:bg-terracotta">
                Send OTP &amp; Proceed <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4 font-sans font-bold">
              <div>
                <label className="block font-sans text-xs font-bold text-brown mb-1">
                  Enter 4-Digit OTP sent to +91 {phone}
                </label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="1 2 3 4"
                  className="w-full rounded-lg border border-brown/30 bg-cream-light py-3 text-center font-sans text-xl font-bold tracking-[0.5em] text-brown focus:border-terracotta focus:outline-none"
                />
              </div>

              <p className="text-center font-sans text-xs font-bold text-brown/70">
                Didn't receive OTP? <button type="button" className="text-terracotta font-bold hover:underline">Resend OTP</button>
              </p>

              <Button type="submit" variant="primary" className="w-full justify-center gap-2 bg-brown text-white hover:bg-terracotta">
                Verify OTP <CheckCircle className="h-4 w-4" />
              </Button>
            </form>
          )}

          {step === "payment" && (
            <form onSubmit={handleCompleteOrder} className="mt-6 space-y-4 font-sans font-bold">
              <div>
                <label className="block font-sans text-xs font-bold text-brown mb-2">
                  Select Express Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`flex flex-col items-center justify-center rounded-lg border p-3 font-sans text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === "upi"
                        ? "border-terracotta bg-terracotta/10 text-terracotta"
                        : "border-brown/20 bg-cream-light text-brown/70 hover:bg-cream"
                    }`}
                  >
                    <Smartphone className="h-5 w-5 mb-1" />
                    Instant UPI
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`flex flex-col items-center justify-center rounded-lg border p-3 font-sans text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === "card"
                        ? "border-terracotta bg-terracotta/10 text-terracotta"
                        : "border-brown/20 bg-cream-light text-brown/70 hover:bg-cream"
                    }`}
                  >
                    <CreditCard className="h-5 w-5 mb-1" />
                    Card / Netbanking
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex flex-col items-center justify-center rounded-lg border p-3 font-sans text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === "cod"
                        ? "border-terracotta bg-terracotta/10 text-terracotta"
                        : "border-brown/20 bg-cream-light text-brown/70 hover:bg-cream"
                    }`}
                  >
                    <Sparkles className="h-5 w-5 mb-1" />
                    Pay on Delivery
                  </button>
                </div>
              </div>

              {paymentMethod === "upi" && (
                <div>
                  <label className="block font-sans text-xs font-bold text-brown mb-1">
                    Enter UPI ID (GPay / PhonePe / Paytm / BHIM)
                  </label>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="mobile@upi or name@okaxis"
                    className="w-full rounded-lg border border-brown/30 bg-cream-light py-2.5 px-3 font-sans text-sm font-bold text-brown focus:border-terracotta focus:outline-none"
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                variant="primary"
                className="w-full justify-center gap-2 bg-brown text-white hover:bg-terracotta disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1 inline" /> Completing Order...
                  </>
                ) : (
                  <>Pay {formatPrice(totalAmount)} &amp; Complete Order</>
                )}
              </Button>
            </form>
          )}

          {step === "success" && (
            <div className="mt-6 text-center space-y-4 py-4 font-sans font-bold">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green/20 text-green">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h3 className="font-display text-3xl text-brown">Order Confirmed!</h3>
              <p className="font-sans text-sm font-bold text-brown/70 max-w-xs mx-auto">
                Thank you for ordering with 9 Stories &amp; Co. We have dispatched your fresh heritage treats! Order ID: #{confirmedOrderId || "9S-SUCCESS"}
              </p>
              <Button onClick={handleReset} variant="primary" className="w-full justify-center bg-brown text-white hover:bg-terracotta">
                Back to Shopping
              </Button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
