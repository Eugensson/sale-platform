import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderDetailsForm } from "@/components/shared/order/order-details-form";

import { auth } from "@/auth";

import { getOrderById } from "@/lib/actions/order.actions";

export const metadata = {
  title: "Admin Order Details",
};

const AdminOrderDetailsPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;

  const order = await getOrderById(id);

  if (!order) notFound();

  const session = await auth();

  return (
    <main className="max-w-6xl mx-auto p-4">
      <div className="flex mb-4">
        <Link href="/admin/orders">Orders</Link>
        <span className="mx-1">›</span>
        <Link href={`/admin/orders/${order._id}`}>{order._id}</Link>
      </div>
      <OrderDetailsForm
        order={order}
        isAdmin={session?.user?.role === "Admin" || false}
      />
    </main>
  );
};

export default AdminOrderDetailsPage;
