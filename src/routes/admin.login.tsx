import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
import * as React from "react";
import logoFull from "@/assets/logo-full.png";

import { useAdminStore } from "@/lib/admin-store.tsx";
import { Button } from "@/components/ui-kit";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const [passcode, setPasscode] = React.useState("");
  const [error, setError] = React.useState(false);
  const { login, isAuthenticated } = useAdminStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/admin" });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(passcode);
    if (success) {
      navigate({ to: "/admin" });
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-brown flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-cream rounded-xl border border-gold/40 p-8 shadow-lift space-y-6">
        <div className="text-center space-y-2">
          <img
            src={logoFull}
            alt="Stories & Co."
            className="mx-auto h-16 w-auto object-contain"
          />
          <h1 className="font-display text-3xl font-normal text-brown">
            Stories &amp; Co. Admin Portal
          </h1>
          <p className="font-sans text-xs font-bold text-brown/70">
            Enter administrative passcode to manage products, orders &amp; site settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 font-sans font-bold">
          <div>
            <label className="block font-sans text-xs font-bold text-brown mb-1">
              Admin Access Passcode
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-brown/50" />
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError(false);
                }}
                placeholder="Enter passcode (admin123)"
                className="w-full rounded-lg border border-brown/30 bg-cream-light py-2.5 pl-10 pr-4 font-sans text-sm font-bold text-brown placeholder:text-brown/50 focus:border-terracotta focus:outline-none"
              />
            </div>
            {error && (
              <p className="mt-2 flex items-center gap-1.5 font-sans text-xs font-bold text-terracotta">
                <AlertCircle className="h-4 w-4 text-terracotta" /> Incorrect passcode. (Default: admin123)
              </p>
            )}
          </div>

          <Button type="submit" variant="primary" className="w-full justify-center gap-2 bg-brown text-white hover:bg-terracotta">
            Access Dashboard <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="rounded-lg border border-gold bg-cream-light p-3 text-center font-sans text-xs font-bold text-brown/70 flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4 text-terracotta shrink-0" />
          <span>Secured Session · Local &amp; Live Data Sync</span>
        </div>
      </div>
    </div>
  );
}
