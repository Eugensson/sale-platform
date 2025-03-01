import Stripe from "stripe";
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

  let client_secret = null;

  if (order.paymentMethod === "Stripe" && !order.isPaid) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100),
      currency: "USD",
      metadata: { orderId: order._id },
    });

    client_secret = paymentIntent.client_secret;
  }

  return (
    <OrderPaymentForm
      order={order}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
      isAdmin={session?.user?.role === "Admin" || false}
      clientSecret={client_secret}
    />
  );
};

export default CheckoutPaymentPage;
