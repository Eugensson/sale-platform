"use client";

import Link from "next/link";
import Image from "next/image";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductPrice } from "@/components/shared/product/product-price";

import { cn, formatDateTime } from "@/lib/utils";
import { IOrder } from "@/lib/db/models/order.model";
import { Separator } from "@/components/ui/separator";

export const OrderDetailsForm = ({
  order,
}: {
  order: IOrder;
  isAdmin: boolean;
}) => {
  const {
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    expectedDeliveryDate,
  } = order;

  return (
    <div className="grid md:grid-cols-3 md:gap-5">
      <div className="overflow-x-auto md:col-span-2 space-y-4">
        <Card>
          <CardContent className="py-4 space-y-4">
            <h2 className="text-xl">Shipping Address</h2>
            <p>
              {shippingAddress.fullName}&nbsp;{shippingAddress.phone}
            </p>
            <p>
              {shippingAddress.street}, {shippingAddress.city},&nbsp;
              {shippingAddress.province}, {shippingAddress.postalCode},&nbsp;
              {shippingAddress.country}
            </p>

            {isDelivered ? (
              <Badge>
                Delivered at {formatDateTime(deliveredAt!).dateTime}
              </Badge>
            ) : (
              <div className="space-y-4">
                <Badge variant="destructive">Not delivered</Badge>
                <p>
                  Expected delivery at&nbsp;
                  {formatDateTime(expectedDeliveryDate!).dateTime}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 space-y-4">
            <h2 className="text-xl">Payment Method</h2>
            <p>{paymentMethod}</p>
            {isPaid ? (
              <Badge>Paid at {formatDateTime(paidAt!).dateTime}</Badge>
            ) : (
              <Badge variant="destructive">Not paid</Badge>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 space-y-4">
            <h2 className="text-xl">Order Items</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="px-2">{item.quantity}</span>
                    </TableCell>
                    <TableCell className="text-right">${item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Card className="h-fit">
        <CardContent className="p-4 space-y-4 gap-4">
          <h2 className="text-xl">Order Summary</h2>
          <div className="flex justify-between">
            <p>Items</p>
            <ProductPrice price={itemsPrice} plain />
          </div>
          <div className="flex justify-between">
            <p>Tax</p>
            <ProductPrice price={taxPrice} plain />
          </div>
          <div className="flex justify-between">
            <p>Shipping</p>
            <ProductPrice price={shippingPrice} plain />
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <p>Total</p>
            <ProductPrice price={totalPrice} plain />
          </div>

          {!isPaid && ["Stripe", "PayPal"].includes(paymentMethod) && (
            <Link
              className={cn(buttonVariants(), "w-full")}
              href={`/checkout/${order._id}`}
            >
              Pay Order
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
