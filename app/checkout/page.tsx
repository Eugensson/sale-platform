import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Checkout",
};

const CheckoutPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/checkout");
  }

  return <div>Checkout Form</div>;
};

export default CheckoutPage;
