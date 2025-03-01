"use client";

import { toast } from "sonner";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { redirect, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { StripeForm } from "@/app/checkout/[id]/stripe-form";
import { CheckoutFooter } from "@/app/checkout/checkout-footer";
import { ProductPrice } from "@/components/shared/product/product-price";

import {
  approvePayPalOrder,
  createPayPalOrder,
} from "@/lib/actions/order.actions";
import { formatDateTime } from "@/lib/utils";
import { IOrder } from "@/lib/db/models/order.model";

interface OrderPaymentFormProps {
  order: IOrder;
  paypalClientId: string;
  isAdmin: boolean;
  clientSecret: string | null;
}

export const OrderPaymentForm = ({
  order,
  paypalClientId,
  clientSecret,
}: OrderPaymentFormProps) => {
  const router = useRouter();

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  const {
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    expectedDeliveryDate,
    isPaid,
  } = order;

  if (isPaid) {
    redirect(`/account/orders/${order._id}`);
  }

  function PrintLoadingState() {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();

    let status = "";

    if (isPending) {
      status = "Loading PayPal...";
    } else if (isRejected) {
      status = "Error in loading PayPal.";
    }

    return status;
  }

  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order._id);

    if (!res.success) return toast(res.message);

    return res.data;
  };

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order._id, data);

    toast(res.message);
  };

  const CheckoutSummary = () => (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="text-lg font-semibold">Order Summary</div>
        <div className="space-y-2">
          <p className="flex justify-between">
            <span>Items:</span>
            <ProductPrice price={itemsPrice} plain />
          </p>
          <p className="flex justify-between">
            Shipping & Handling:
            <span>
              {shippingPrice === undefined ? (
                "--"
              ) : shippingPrice === 0 ? (
                "FREE"
              ) : (
                <ProductPrice price={shippingPrice} plain />
              )}
            </span>
          </p>
          <p className="flex justify-between">
            Tax:
            <span>
              {taxPrice === undefined ? (
                "--"
              ) : (
                <ProductPrice price={taxPrice} plain />
              )}
            </span>
          </p>
          <Separator />
          <p className="flex justify-between pb-4 font-semibold text-lg">
            <span>Order Total:</span>
            <ProductPrice price={totalPrice} plain />
          </p>

          {!isPaid && paymentMethod === "PayPal" && (
            <PayPalScriptProvider options={{ clientId: paypalClientId }}>
              <PrintLoadingState />
              <PayPalButtons
                createOrder={handleCreatePayPalOrder}
                onApprove={handleApprovePayPalOrder}
              />
            </PayPalScriptProvider>
          )}

          {!isPaid && paymentMethod === "Stripe" && clientSecret && (
            <Elements
              options={{
                clientSecret,
              }}
              stripe={stripePromise}
            >
              <StripeForm
                priceInCents={Math.round(order.totalPrice * 100)}
                orderId={order._id}
              />
            </Elements>
          )}

          {!isPaid && paymentMethod === "Cash On Delivery" && (
            <Button
              className="w-full rounded-md"
              onClick={() => router.push(`/account/orders/${order._id}`)}
            >
              View Order
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <main className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <div className="grid md:grid-cols-3 my-4">
            <p className="text-lg font-semibold">Shipping Address</p>
            <p className="col-span-2">
              {shippingAddress.fullName} <br />
              {shippingAddress.street} <br />
              {`${shippingAddress.city}, ${shippingAddress.province}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}
            </p>
          </div>
          <Separator />
          <div className="grid md:grid-cols-3 my-4">
            <p className="text-lg font-semibold">Payment Method</p>
            <p className="col-span-2">{paymentMethod}</p>
          </div>
          <Separator />
          <div className="grid md:grid-cols-3 my-4">
            <p className="flex text-lg font-bold">Items and shipping</p>
            <div className="col-span-2">
              <p>
                Delivery date:&nbsp;
                {formatDateTime(expectedDeliveryDate).dateOnly}
              </p>
              <ul>
                {items.map((item) => (
                  <li key={item.slug}>
                    {item.name} x {item.quantity} = {item.price}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="block md:hidden">
            <CheckoutSummary />
          </div>
          <CheckoutFooter />
        </div>
        <div className="hidden md:block">
          <CheckoutSummary />
        </div>
      </div>
    </main>
  );
};
