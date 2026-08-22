import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { useAdmin } from "@/components/admin/admin-store";
import {
  MiniBarChart,
  PageHeader,
  Panel,
  Pill,
  StatCard,
  Table,
  Td,
  Tr,
  statusTone,
} from "@/components/admin/admin-ui";
import { revenueSeries } from "@/lib/admin-data";
import { formatPrice } from "@/lib/products";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard — 9 Stories & Co. Admin" },
      { name: "description", content: "Revenue, orders and inventory at a glance." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { orders, products, customers, reviews } = useAdmin();
  const revenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter((o) => o.status === "Pending").length;
  const lowStock = products.filter((p) => p.stock < 40);

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="A quiet overview of the storefront — today, this week, this season."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue" value={formatPrice(revenue)} delta="+18.2%" hint="vs last month" />
        <StatCard label="Orders" value={String(orders.length)} delta="+6" hint="this week" />
        <StatCard label="Customers" value={String(customers.length)} delta="+2" hint="new signups" />
        <StatCard label="Avg. order value" value={formatPrice(Math.round(revenue / Math.max(orders.length, 1)))} delta="-1.4%" hint="vs last month" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Revenue" description="Last seven months, in thousands of rupees.">
          <MiniBarChart data={revenueSeries} />
        </Panel>

        <Panel title="Needs attention">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between gap-3 rounded-[10px] bg-secondary/60 px-4 py-3">
              <span>Orders awaiting packing</span>
              <Pill tone="warning">{pending}</Pill>
            </li>
            <li className="flex items-center justify-between gap-3 rounded-[10px] bg-secondary/60 px-4 py-3">
              <span>Low stock items</span>
              <Pill tone="danger">{lowStock.length}</Pill>
            </li>
            <li className="flex items-center justify-between gap-3 rounded-[10px] bg-secondary/60 px-4 py-3">
              <span>Reviews to moderate</span>
              <Pill tone="accent">{reviews.filter((r) => r.status === "Pending").length}</Pill>
            </li>
          </ul>
          <Link
            to="/admin/orders"
            className="mt-5 inline-flex items-center gap-1.5 text-xs tracking-wide text-accent hover:underline"
          >
            Go to orders <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="Recent orders"
          actions={
            <Link to="/admin/orders" className="text-xs tracking-wide text-accent hover:underline">
              View all
            </Link>
          }
        >
          <Table head={["Order", "Customer", "Status", "Total"]}>
            {orders.slice(0, 5).map((o) => (
              <Tr key={o.id}>
                <Td className="font-medium text-primary">{o.id}</Td>
                <Td>{o.customer}</Td>
                <Td>
                  <Pill tone={statusTone(o.status)}>{o.status}</Pill>
                </Td>
                <Td>{formatPrice(o.total)}</Td>
              </Tr>
            ))}
          </Table>
        </Panel>

        <Panel
          title="Inventory"
          actions={
            <Link to="/admin/products" className="text-xs tracking-wide text-accent hover:underline">
              Manage
            </Link>
          }
        >
          <Table head={["Product", "Status", "Stock"]}>
            {products.map((p) => (
              <Tr key={p.slug}>
                <Td>
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="h-9 w-9 rounded-md object-cover" />
                    <span>{p.name}</span>
                  </div>
                </Td>
                <Td>
                  <Pill tone={statusTone(p.status)}>{p.status}</Pill>
                </Td>
                <Td className={p.stock < 40 ? "text-destructive" : undefined}>{p.stock}</Td>
              </Tr>
            ))}
          </Table>
        </Panel>
      </div>
    </>
  );
}
