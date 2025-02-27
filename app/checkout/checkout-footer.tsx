import Link from "next/link";

import { APP_NAME } from "@/lib/constants";

export const CheckoutFooter = () => {
  return (
    <ul className="flex flex-col justify-center gap-2 text-xs sm:text-sm border-t-2 py-4">
      <li>
        Need help? Check our&nbsp;
        <Link
          href="/page/help"
          className="text-sky-700 hover:text-orange-700 hover:underline"
        >
          Help Center
        </Link>
        &nbsp;or&nbsp;
        <Link
          href="/page/contact-us"
          className="text-sky-700 hover:text-orange-700 hover:underline"
        >
          Contact Us.
        </Link>
      </li>
      <li>
        For an item ordered from {APP_NAME}: When you click the &apos;Place Your
        Order&apos; button, we will send you an e-mail acknowledging receipt of
        your order. Your contract to purchase an item will not be complete until
        we send you an e-mail notifying you that the item has been shipped to
        you. By placing your order, you agree to {APP_NAME}
        &apos;s&nbsp;
        <Link
          href="/page/privacy-policy"
          className="text-sky-700 hover:text-orange-700 hover:underline"
        >
          privacy notice
        </Link>
        &nbsp;and&nbsp;
        <Link
          href="/page/conditions-of-use"
          className="text-sky-700 hover:text-orange-700 hover:underline"
        >
          conditions of use.
        </Link>
      </li>
      <li>
        Within 30 days of delivery, you may return new, unopened merchandise in
        its original condition. Exceptions and restrictions apply. See&nbsp;
        <Link
          href="/page/conditions-of-use"
          className="text-sky-700 hover:text-orange-700 hover:underline"
        >
          {APP_NAME}&apos;s Returns Policy
        </Link>
        .
      </li>
    </ul>
  );
};
