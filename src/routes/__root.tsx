import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useMatchRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "@/components/cart";
import { AdminStoreProvider } from "@/lib/admin-store.tsx";
import { CustomerAuthProvider } from "@/lib/customer-auth.tsx";
import { AuthModal } from "@/components/auth-modal.tsx";
import { WishlistDrawer } from "@/components/wishlist-drawer.tsx";
import { Navbar } from "@/components/navbar";
import { Footer, Newsletter } from "@/components/footer";
import { StructuredData } from "@/components/seo";
import { GoogleAnalytics } from "@/components/analytics";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow text-accent">404</p>
        <h1 className="mt-4 text-4xl text-primary font-display">This page has melted away</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center rounded-[10px] bg-accent px-6 text-[0.8125rem] font-medium tracking-[0.08em] text-accent-foreground uppercase transition-colors hover:bg-accent-hover"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset?: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error as Error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl text-primary font-display">This page didn't load</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset?.();
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-[10px] bg-accent px-6 text-[0.8125rem] font-medium tracking-[0.08em] text-accent-foreground uppercase transition-colors hover:bg-accent-hover"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-[10px] border border-primary px-6 text-[0.8125rem] font-medium tracking-[0.08em] text-primary uppercase"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "9 Stories & Co. — Handcrafted Andhra Putharekulu | Premium Indian Sweets" },
      {
        name: "description",
        content:
          "Authentic handcrafted Putharekulu from Andhra Pradesh. Paper-thin layers, pure ghee, made fresh in small batches. Order premium Indian sweets online for delivery across India.",
      },
      { name: "keywords", content: "Putharekulu, Andhra sweets, Indian sweets, handcrafted sweets, premium sweets, traditional sweets, authentic Indian food, Diwali sweets, wedding sweets, gifting sweets" },
      { name: "author", content: "9 Stories & Co." },
      { name: "robots", content: "index, follow" },
      { property: "og:site_name", content: "9 Stories & Co." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "9 Stories & Co. — Handcrafted Andhra Putharekulu" },
      { property: "og:description", content: "Authentic handcrafted Putharekulu from Andhra Pradesh. Paper-thin layers, pure ghee, made fresh in small batches." },
      { property: "og:image", content: "https://9storiesandco.com/hero-putharekulu.jpg" },
      { property: "og:url", content: "https://9storiesandco.com" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Chathura:wght@700&family=Dancing+Script:wght@700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "canonical", href: "https://9storiesandco.com" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const matchRoute = useMatchRoute();
  const isAdminRoute = matchRoute({ to: "/admin", fuzzy: true });

  return (
    <QueryClientProvider client={queryClient}>
      <AdminStoreProvider>
        <CustomerAuthProvider>
          <CartProvider>
            <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
            <StructuredData type="organization" data={{}} />
            
            {/* Hide public header/footer on admin routes */}
            {!isAdminRoute && <Navbar />}

            <main>
              <Outlet />
            </main>

            {!isAdminRoute && (
              <>
                <Newsletter />
                <Footer />
                <AuthModal />
                <WishlistDrawer />
              </>
            )}
          </CartProvider>
        </CustomerAuthProvider>
      </AdminStoreProvider>
    </QueryClientProvider>
  );
}
