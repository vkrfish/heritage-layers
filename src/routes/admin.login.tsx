import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
import * as React from "react";

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
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-cream rounded-3xl border border-gold/40 p-8 shadow-lift space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-gold font-display text-2xl font-bold border border-gold">
            9
          </div>
          <h1 className="font-display text-2xl font-light text-primary">
            9 Stories &amp; Co. Admin Portal
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter administrative passcode to manage products, orders &amp; site settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              Admin Access Passcode
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError(false);
                }}
                placeholder="Enter passcode (admin123)"
                className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm font-medium text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
            </div>
            {error && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive font-semibold">
                <AlertCircle className="h-3.5 w-3.5" /> Incorrect passcode. (Default: admin123)
              </p>
            )}
          </div>

          <Button type="submit" className="w-full justify-center gap-2">
            Access Dashboard <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="rounded-xl border border-gold/30 bg-parchment/60 p-3 text-center text-[11px] text-muted-foreground flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
          <span>Secured Session · Local &amp; Live Data Sync</span>
        </div>
      </div>
    </div>
  );
}
