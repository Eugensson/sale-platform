"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

import { sendPurchaseReceipt } from "@/emails";

import { paypal } from "@/lib/paypal";
import { connectToDatabase } from "@/lib/db";
import { formatError, round2 } from "@/lib/utils";
import { OrderInputSchema } from "@/lib/validator";
import { AVAILABLE_DELIVERY_DATES, PAGE_SIZE } from "@/lib/constants";
import { IOrder, Order } from "@/lib/db/models/order.model";

import { Cart, OrderItem, ShippingAddress } from "@/types";

type Props = {
  shippingAddress?: ShippingAddress;
  deliveryDateIndex?: number;
  items: OrderItem[];
};

export const calcDeliveryDateAndPrice = async ({
  items,
  deliveryDateIndex,
  shippingAddress,
}: Props) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  const deliveryDate =
    AVAILABLE_DELIVERY_DATES[
      deliveryDateIndex === undefined
        ? AVAILABLE_DELIVERY_DATES.length - 1
        : deliveryDateIndex
    ];

  const shippingPrice =
    !shippingAddress || !deliveryDate
      ? undefined
      : deliveryDate.freeShippingMinPrice > 0 &&
          itemsPrice >= deliveryDate.freeShippingMinPrice
        ? 0
        : deliveryDate.shippingPrice;

  const taxPrice = !shippingAddress ? undefined : round2(itemsPrice * 0.15);

  const totalPrice = round2(
    itemsPrice +
      (shippingPrice ? round2(shippingPrice) : 0) +
      (taxPrice ? round2(taxPrice) : 0)
  );

  return {
    AVAILABLE_DELIVERY_DATES,
    deliveryDateIndex:
      deliveryDateIndex === undefined
        ? AVAILABLE_DELIVERY_DATES.length - 1
        : deliveryDateIndex,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
};

export const createOrder = async (clientSideCart: Cart) => {
  try {
    await connectToDatabase();

    const session = await auth();

    if (!session) throw new Error("User not authenticated");

    const createdOrder = await createOrderFromCart(
      clientSideCart,
      session.user.id!
    );

    return {
      success: true,
      message: "Order placed successfully",
      data: { orderId: createdOrder._id.toString() },
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const createOrderFromCart = async (
  clientSideCart: Cart,
  userId: string
) => {
  const cart = {
    ...clientSideCart,
    ...calcDeliveryDateAndPrice({
      items: clientSideCart.items,
      shippingAddress: clientSideCart.shippingAddress,
      deliveryDateIndex: clientSideCart.deliveryDateIndex,
    }),
  };

  const order = OrderInputSchema.parse({
    user: userId,
    items: cart.items,
    shippingAddress: cart.shippingAddress,
    paymentMethod: cart.paymentMethod,
    itemsPrice: cart.itemsPrice,
    shippingPrice: cart.shippingPrice,
    taxPrice: cart.taxPrice,
    totalPrice: cart.totalPrice,
    expectedDeliveryDate: cart.expectedDeliveryDate,
  });
  return await Order.create(order);
};

export const getOrderById = async (orderId: string): Promise<IOrder> => {
  await connectToDatabase();
  const order = await Order.findById(orderId);
  return JSON.parse(JSON.stringify(order));
};

export const createPayPalOrder = async (orderId: string) => {
  await connectToDatabase();
  try {
    const order = await Order.findById(orderId);
    if (order) {
      const paypalOrder = await paypal.createOrder(order.totalPrice);
      order.paymentResult = {
        id: paypalOrder.id,
        email_address: "",
        status: "",
        pricePaid: "0",
      };
      await order.save();
      return {
        success: true,
        message: "PayPal order created successfully",
        data: paypalOrder.id,
      };
    } else {
      throw new Error("Order not found");
    }
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
};

export const approvePayPalOrder = async (
  orderId: string,
  data: { orderID: string }
) => {
  await connectToDatabase();

  try {
    const order = await Order.findById(orderId).populate("user", "email");
    if (!order) throw new Error("Order not found");

    const captureData = await paypal.capturePayment(data.orderID);

    if (
      !captureData ||
      captureData.id !== order.paymentResult?.id ||
      captureData.status !== "COMPLETED"
    )
      throw new Error("Error in paypal payment");

    order.isPaid = true;

    order.paidAt = new Date();

    order.paymentResult = {
      id: captureData.id,
      status: captureData.status,
      email_address: captureData.payer.email_address,
      pricePaid:
        captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
    };

    await order.save();

    await sendPurchaseReceipt({ order });

    revalidatePath(`/account/orders/${orderId}`);

    return {
      success: true,
      message: "Your order has been successfully paid by PayPal",
    };
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
};

export const getMyOrders = async ({
  limit,
  page,
}: {
  limit?: number;
  page: number;
}) => {
  limit = limit || PAGE_SIZE;

  await connectToDatabase();

  const session = await auth();

  if (!session) {
    throw new Error("User is not authenticated");
  }

  const skipAmount = (Number(page) - 1) * limit;

  const orders = await Order.find({
    user: session?.user?.id,
  })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(limit);

  const ordersCount = await Order.countDocuments({ user: session?.user?.id });

  return {
    data: JSON.parse(JSON.stringify(orders)),
    totalPages: Math.ceil(ordersCount / limit),
  };
};
