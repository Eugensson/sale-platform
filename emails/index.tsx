import nodemailer from "nodemailer";
import { render } from "@react-email/render";

import PurchaseReceiptEmail from "@/emails/purchase-receipt";

import { IOrder } from "@/lib/db/models/order.model";
import { EMAIL_SENDER, PASS, SENDER_NAME } from "@/lib/constants";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user: EMAIL_SENDER, pass: PASS },
});

export const sendPurchaseReceipt = async ({ order }: { order: IOrder }) => {
  try {
    const emailHtml = await render(<PurchaseReceiptEmail order={order} />);

    await transporter.sendMail({
      from: `${SENDER_NAME} <${EMAIL_SENDER}>`,
      to: (order.user as { email: string }).email,
      subject: "Order Confirmation",
      html: emailHtml,
    });
  } catch (error) {
    console.error(error);
  }
};
