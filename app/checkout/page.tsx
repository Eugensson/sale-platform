import { Metadata } from "next";
import { redirect } from "next/navigation";

import { CheckoutForm } from "@/app/checkout/checkout-form";

import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Checkout",
};

const CheckoutPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/checkout");
  }

  return <CheckoutForm />;
};

export default CheckoutPage;
