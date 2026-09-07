import * as Dialog from "@radix-ui/react-dialog";
import { X, ShieldCheck, Smartphone, CheckCircle, ArrowRight, CreditCard, Sparkles } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui-kit";
import { formatPrice } from "@/lib/products";

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

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("success");
  };

  const handleReset = () => {
    setStep("mobile");
    setPhone("");
    setOtp("");
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-2xl border border-border bg-cream p-6 shadow-lift duration-200 data-[state=open]:animate-in data-[state=open]:zoom-in-95 sm:p-8">
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-accent/10 text-accent font-display text-sm">⚡</span>
              <div>
                <Dialog.Title className="font-display text-xl text-primary leading-tight">
                  Express One-Click Checkout
                </Dialog.Title>
                <p className="text-xs text-muted-foreground">Fast, secure &amp; encrypted purchase</p>
              </div>
            </div>
            <Dialog.Close aria-label="Close modal" className="rounded-full p-2 text-muted-foreground hover:bg-parchment hover:text-primary">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          {/* Item Summary Bar */}
          <div className="mt-4 flex items-center justify-between rounded-xl border border-gold/30 bg-parchment/50 p-3.5">
            <div>
              <p className="text-xs font-semibold text-primary">{productName}</p>
              <p className="text-[11px] text-muted-foreground">{variantLabel} × {qty}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-sm font-bold text-accent">{formatPrice(totalAmount)}</p>
            </div>
          </div>

          {step === "mobile" && (
            <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-primary mb-1">
                  Mobile Number (for instant OTP login)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-sm text-muted-foreground">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="98765 43210"
                    className="w-full rounded-lg border border-border bg-card py-2.5 pl-12 pr-4 text-sm font-medium text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-lg bg-teal/5 p-3 text-[11px] text-teal-soft flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
                <span>We'll auto-fetch your saved address via secure mobile OTP.</span>
              </div>

              <Button type="submit" className="w-full justify-center gap-2 mt-2">
                Send OTP &amp; Proceed <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-primary mb-1">
                  Enter 4-Digit OTP sent to +91 {phone}
                </label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="1 2 3 4"
                  className="w-full rounded-lg border border-border bg-card py-3 text-center text-lg font-bold tracking-[0.5em] text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <p className="text-center text-xs text-muted-foreground">
                Didn't receive OTP? <button type="button" className="text-accent font-medium hover:underline">Resend OTP</button>
              </p>

              <Button type="submit" className="w-full justify-center gap-2">
                Verify OTP <CheckCircle className="h-4 w-4" />
              </Button>
            </form>
          )}

          {step === "payment" && (
            <form onSubmit={handleCompleteOrder} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-primary mb-2">
                  Select Express Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 text-xs font-medium transition-all ${
                      paymentMethod === "upi"
                        ? "border-accent bg-accent/10 text-accent font-bold shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:bg-parchment"
                    }`}
                  >
                    <Smartphone className="h-5 w-5 mb-1" />
                    Instant UPI
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 text-xs font-medium transition-all ${
                      paymentMethod === "card"
                        ? "border-accent bg-accent/10 text-accent font-bold shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:bg-parchment"
                    }`}
                  >
                    <CreditCard className="h-5 w-5 mb-1" />
                    Card / Netbanking
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 text-xs font-medium transition-all ${
                      paymentMethod === "cod"
                        ? "border-accent bg-accent/10 text-accent font-bold shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:bg-parchment"
                    }`}
                  >
                    <Sparkles className="h-5 w-5 mb-1" />
                    Pay on Delivery
                  </button>
                </div>
              </div>

              {paymentMethod === "upi" && (
                <div>
                  <label className="block text-xs font-medium text-primary mb-1">
                    Enter UPI ID (GPay / PhonePe / Paytm / BHIM)
                  </label>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="mobile@upi or name@okaxis"
                    className="w-full rounded-lg border border-border bg-card py-2.5 px-3 text-sm text-primary focus:border-accent focus:outline-none"
                  />
                </div>
              )}

              <Button type="submit" className="w-full justify-center gap-2">
                Pay {formatPrice(totalAmount)} &amp; Complete Order
              </Button>
            </form>
          )}

          {step === "success" && (
            <div className="mt-6 text-center space-y-4 py-4">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent/20 text-accent">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h3 className="font-display text-2xl text-primary">Order Confirmed!</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Thank you for ordering with 9 Stories &amp; Co. We have dispatched your fresh heritage treats! Order ID: #9S-{Math.floor(100000 + Math.random() * 900000)}
              </p>
              <Button onClick={handleReset} className="w-full justify-center">
                Back to Shopping
              </Button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
