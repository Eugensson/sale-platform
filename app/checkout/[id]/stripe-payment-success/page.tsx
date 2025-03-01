import Stripe from "stripe";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";

import { getOrderById } from "@/lib/actions/order.actions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const SuccessPage = async (props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment_intent: string }>;
}) => {
  const { id } = await props.params;

  const searchParams = await props.searchParams;

  const order = await getOrderById(id);

  if (!order) notFound();

  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  );

  if (
    paymentIntent.metadata.orderId == null ||
    paymentIntent.metadata.orderId !== order._id.toString()
  )
    return notFound();

  const isSuccess = paymentIntent.status === "succeeded";

  if (!isSuccess) return redirect(`/checkout/${id}`);

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8">
      <div className="flex flex-col gap-6 items-center ">
        <h1 className="font-semibold text-2xl lg:text-3xl">
          Thanks for your purchase
        </h1>
        <p>We are now processing your order.</p>
        <Button asChild>
          <Link href={`/account/orders/${id}`}>View order</Link>
        </Button>
      </div>
    </div>
  );
};

export default SuccessPage;
