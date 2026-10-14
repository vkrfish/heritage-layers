import * as Dialog from "@radix-ui/react-dialog";
import { X, Mail, Lock, User as UserIcon, Phone, ArrowRight, Loader2, Sparkles } from "lucide-react";
import * as React from "react";
import { useCustomerAuth } from "@/lib/customer-auth";
import { Button } from "@/components/ui-kit";
import logoFull from "@/assets/logo-full.png";

export function AuthModal() {
  const {
    authModalOpen,
    authModalMode,
    setAuthModalMode,
    closeAuthModal,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
  } = useCustomerAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successNotice, setSuccessNotice] = React.useState<string | null>(null);

  const isSignUp = authModalMode === "signup";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessNotice(null);

    if (isSignUp) {
      const res = await signUpWithEmail(email, password, fullName, phone);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || "Could not create account");
      } else {
        setSuccessNotice("Account created! Check your email to confirm or continue.");
      }
    } else {
      const res = await signInWithEmail(email, password);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || "Invalid email or password");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to initiate Google login");
    }
  };

  return (
    <Dialog.Root open={authModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-brown/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-2xl border border-gold/40 bg-cream p-6 sm:p-8 shadow-lift duration-200 data-[state=open]:animate-in data-[state=open]:zoom-in-95 font-sans">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img src={logoFull} alt="9 Stories" className="h-10 w-auto object-contain" />
              <div>
                <Dialog.Title className="font-display text-2xl text-brown font-normal">
                  {isSignUp ? "Join 9 Stories & Co." : "Welcome Back"}
                </Dialog.Title>
                <p className="text-xs font-bold text-brown/70 mt-0.5">
                  Sign in to add items to your cart &amp; manage orders
                </p>
              </div>
            </div>
            <Dialog.Close
              aria-label="Close modal"
              className="rounded-full p-1.5 text-brown/60 hover:bg-brown/10 hover:text-brown cursor-pointer transition-colors"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {/* Social Google Login Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 rounded-lg border border-brown/30 bg-white py-2.5 px-4 font-sans text-xs font-bold text-brown shadow-sm hover:bg-cream-light hover:border-gold transition-colors cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brown/20" />
            </div>
            <span className="relative bg-cream px-3 font-sans text-[11px] font-bold uppercase tracking-wider text-brown/60">
              or with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 font-sans font-bold">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-xs font-bold text-brown mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-brown/50" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ananya Rao"
                      className="w-full rounded-lg border border-brown/30 bg-cream-light py-2 pl-9 pr-3 text-xs text-brown focus:border-terracotta focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brown mb-1">Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-brown/50" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full rounded-lg border border-brown/30 bg-cream-light py-2 pl-9 pr-3 text-xs text-brown focus:border-terracotta focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-brown mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-brown/50" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.name@gmail.com"
                  className="w-full rounded-lg border border-brown/30 bg-cream-light py-2 pl-9 pr-3 text-xs text-brown focus:border-terracotta focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brown mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-brown/50" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full rounded-lg border border-brown/30 bg-cream-light py-2 pl-9 pr-3 text-xs text-brown focus:border-terracotta focus:outline-none"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="rounded-md bg-terracotta/10 p-2 text-xs font-bold text-terracotta border border-terracotta/20">
                {errorMsg}
              </p>
            )}

            {successNotice && (
              <p className="rounded-md bg-green/10 p-2 text-xs font-bold text-green border border-green/20">
                {successNotice}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              className="w-full justify-center gap-2 bg-brown text-white hover:bg-terracotta disabled:opacity-60 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  {isSignUp ? "Create Account & Continue" : "Sign In & Continue"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle between Sign In / Sign Up */}
          <div className="mt-4 pt-3 border-t border-brown/15 text-center text-xs font-bold text-brown/70">
            {isSignUp ? (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode("signin");
                    setErrorMsg(null);
                  }}
                  className="text-terracotta underline font-extrabold cursor-pointer hover:text-brown"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                New to 9 Stories &amp; Co.?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode("signup");
                    setErrorMsg(null);
                  }}
                  className="text-terracotta underline font-extrabold cursor-pointer hover:text-brown"
                >
                  Create an Account
                </button>
              </p>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
