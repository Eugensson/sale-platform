import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderDetailsForm } from "@/components/shared/order/order-details-form";

import { auth } from "@/auth";

import { formatId } from "@/lib/utils";
import { getOrderById } from "@/lib/actions/order.actions";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  return {
    title: `Order ${formatId(id)}`,
  };
}

export default async function OrderDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const order = await getOrderById(id);

  if (!order) notFound();

  const session = await auth();

  return (
    <>
      <div className="flex items-center gap-2">
        <Link href="/account" className="hover:underline text-xs md:text-sm">
          Your Account
        </Link>
        <span>›</span>
        <Link
          href="/account/orders"
          className="hover:underline text-xs md:text-sm"
        >
          Your Orders
        </Link>
        <span>›</span>
        <span className="text-xs md:text-sm">Order #{formatId(order._id)}</span>
      </div>
      <h1 className="py-4 text-2xl">
        Order #
        <span className="text-xl font-primary font-normal">{order._id}</span>
      </h1>
      <OrderDetailsForm
        order={order}
        isAdmin={session?.user?.role === "Admin" || false}
      />
    </>
  );
}
