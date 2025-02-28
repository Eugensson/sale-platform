import { notFound } from "next/navigation";

import { OrderPaymentForm } from "@/app/checkout/[id]/payment-form";

import { auth } from "@/auth";

import { getOrderById } from "@/lib/actions/order.actions";

export const metadata = {
  title: "Payment",
};

const CheckoutPaymentPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await props.params;

  const order = await getOrderById(id);

  if (!order) notFound();

  const session = await auth();

  return (
    <OrderPaymentForm
      order={order}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
      isAdmin={session?.user?.role === "Admin" || false}
    />
  );
};

export default CheckoutPaymentPage;
