"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProductPrice } from "@/components/shared/product/product-price";
import { BrowsingHistoryList } from "@/components/shared/browsing-history-list";

import { useCartStore } from "@/hooks/use-cart-store";

import { APP_NAME, FREE_SHIPPING_MIN_PRICE } from "@/lib/constants";

const CartPage = () => {
  const {
    cart: { items, itemsPrice },
    updateItem,
    removeItem,
  } = useCartStore();

  const router = useRouter();

  return (
    <div className="container py-6 md:py-12 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-4  md:gap-4">
        {items.length === 0 ? (
          <Card className="col-span-4 rounded-2xl shadow-md">
            <CardHeader className="text-3xl  ">
              Your Shopping Cart is empty
            </CardHeader>
            <CardContent>
              Continue shopping on <Link href="/">{APP_NAME}</Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="col-span-3">
              <Card className="rounded-2xl shadow-md">
                <CardHeader className="text-3xl pb-0">Shopping Cart</CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-end border-b mb-4">Price</div>

                  {items.map((item) => (
                    <div
                      key={item.clientId}
                      className="flex flex-col md:flex-row justify-between py-4 border-b gap-4"
                    >
                      <Link href={`/product/${item.slug}`}>
                        <div className="relative w-40 h-40">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="20vw"
                            style={{
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      </Link>

                      <div className="flex-1 space-y-4">
                        <Link
                          href={`/product/${item.slug}`}
                          className="text-lg hover:no-underline  "
                        >
                          {item.name}
                        </Link>
                        <div>
                          <p className="text-sm">
                            <span className="font-semibold">Color:</span>&nbsp;
                            {item.color}
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold">Size:</span>&nbsp;
                            {item.size}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Select
                            value={item.quantity.toString()}
                            onValueChange={(value) =>
                              updateItem(item, Number(value))
                            }
                          >
                            <SelectTrigger className="h-10 w-32">
                              <SelectValue>
                                Quantity:&nbsp;{item.quantity}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent position="popper">
                              {Array.from({
                                length: item.countInStock,
                              }).map((_, i) => (
                                <SelectItem key={i + 1} value={`${i + 1}`}>
                                  {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeItem(item)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-right">
                          {item.quantity > 1 && (
                            <>
                              {item.quantity}&nbsp;x&nbsp;
                              <ProductPrice price={item.price} plain />
                              <br />
                            </>
                          )}

                          <span className="font-semibold text-lg">
                            <ProductPrice
                              price={item.price * item.quantity}
                              plain
                            />
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end text-lg my-2">
                    Subtotal (
                    {items.reduce((acc, item) => acc + item.quantity, 0)}&nbsp;
                    items):&nbsp;
                    <span className="font-semibold">
                      <ProductPrice price={itemsPrice} plain />
                    </span>
                    &nbsp;
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="rounded-2xl shadow-md">
                <CardContent className="py-4 space-y-4">
                  {itemsPrice < FREE_SHIPPING_MIN_PRICE ? (
                    <div className="flex-1">
                      Add&nbsp;
                      <span className="text-green-700">
                        <ProductPrice
                          price={FREE_SHIPPING_MIN_PRICE - itemsPrice}
                          plain
                        />
                      </span>
                      &nbsp; of eligible items to your order to qualify for FREE
                      Shipping
                    </div>
                  ) : (
                    <p>
                      <span className="text-green-700">
                        Your order qualifies for FREE Shipping.
                      </span>
                      &nbsp;Choose this option at checkout
                    </p>
                  )}
                  <p className="text-lg">
                    Subtotal&nbsp;(
                    {items.reduce((acc, item) => acc + item.quantity, 0)}
                    &nbsp;items):&nbsp;
                    <span className="font-semibold">
                      <ProductPrice price={itemsPrice} plain />
                    </span>
                  </p>
                  <Button
                    onClick={() => router.push("/checkout")}
                    className="rounded-md w-full"
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
      <BrowsingHistoryList />
    </div>
  );
};

export default CartPage;
