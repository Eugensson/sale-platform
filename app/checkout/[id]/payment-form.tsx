"use client";

import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";

import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
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
}

export const OrderPaymentForm = ({
  order,
  paypalClientId,
}: OrderPaymentFormProps) => {
  const router = useRouter();
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
      <CardContent className="p-4">
        <div>
          <div className="text-lg font-bold">Order Summary</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Items:</span>
              <span>
                {" "}
                <ProductPrice price={itemsPrice} plain />
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping & Handling:</span>
              <span>
                {shippingPrice === undefined ? (
                  "--"
                ) : shippingPrice === 0 ? (
                  "FREE"
                ) : (
                  <ProductPrice price={shippingPrice} plain />
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span> Tax:</span>
              <span>
                {taxPrice === undefined ? (
                  "--"
                ) : (
                  <ProductPrice price={taxPrice} plain />
                )}
              </span>
            </div>
            <div className="flex justify-between  pt-1 font-bold text-lg">
              <span> Order Total:</span>
              <span>
                {" "}
                <ProductPrice price={totalPrice} plain />
              </span>
            </div>

            {!isPaid && paymentMethod === "PayPal" && (
              <div>
                <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                  <PrintLoadingState />
                  <PayPalButtons
                    createOrder={handleCreatePayPalOrder}
                    onApprove={handleApprovePayPalOrder}
                  />
                </PayPalScriptProvider>
              </div>
            )}

            {!isPaid && paymentMethod === "Cash On Delivery" && (
              <Button
                className="w-full rounded-full"
                onClick={() => router.push(`/account/orders/${order._id}`)}
              >
                View Order
              </Button>
            )}
          </div>
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
