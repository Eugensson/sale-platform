import {
  CreditCard,
  Currency,
  ImageIcon,
  Info,
  Languages,
  Package,
  SettingsIcon,
} from "lucide-react";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "SalePlatform";

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const SENDER_EMAIL = process.env.SENDER_EMAIL || "onboarding@resend.dev";

export const SENDER_NAME = process.env.SENDER_NAME || APP_NAME;

export const APP_SLOGAN =
  process.env.NEXT_PUBLIC_APP_SLOGAN || "Spend less, enjoy more";

export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "A digital marketplace built with Next.js and MongoDB";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 9);

export const FREE_SHIPPING_MIN_PRICE = Number(
  process.env.FREE_SHIPPING_MIN_PRICE || 35
);

export const APP_COPYRIGHT =
  process.env.NEXT_PUBLIC_APP_COPYRIGHT ||
  `Copyright &copy; 2025 ${APP_NAME}. All rights reserved.`;

export const AVAILABLE_PAYMENT_METHODS = [
  {
    name: "PayPal",
    commission: 0,
    isDefault: true,
  },
  {
    name: "Stripe",
    commission: 0,
    isDefault: true,
  },
  {
    name: "Cash On Delivery",
    commission: 0,
    isDefault: true,
  },
];

export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || "PayPal";

export const AVAILABLE_DELIVERY_DATES = [
  {
    name: "Tomorrow",
    daysToDeliver: 1,
    shippingPrice: 12.9,
    freeShippingMinPrice: 0,
  },
  {
    name: "Next 3 Days",
    daysToDeliver: 3,
    shippingPrice: 6.9,
    freeShippingMinPrice: 0,
  },
  {
    name: "Next 5 Days",
    daysToDeliver: 5,
    shippingPrice: 4.9,
    freeShippingMinPrice: 35,
  },
];

export const USER_ROLES = ["Admin", "User"];

export const COLORS = ["Gold", "Green", "Red"];

export const THEMES = ["Light", "Dark", "System"];

export const ADMIN_NAV_LINKS = [
  {
    title: "Overview",
    href: "/admin/overview",
  },
  {
    title: "Products",
    href: "/admin/products",
  },
  {
    title: "Orders",
    href: "/admin/orders",
  },
  {
    title: "Users",
    href: "/admin/users",
  },
  {
    title: "Pages",
    href: "/admin/web-pages",
  },
  {
    title: "Settings",
    href: "/admin/settings",
  },
];

export const ADMIN_SETTINGS_NAV_LINKS = [
  { name: "Site Info", hash: "setting-site-info", icon: Info },
  {
    name: "Common Settings",
    hash: "setting-common",
    icon: SettingsIcon,
  },
  {
    name: "Carousels",
    hash: "setting-carousels",
    icon: ImageIcon,
  },
  { name: "Languages", hash: "setting-languages", icon: Languages },
  {
    name: "Currencies",
    hash: "setting-currencies",
    icon: Currency,
  },
  {
    name: "Payment Methods",
    hash: "setting-payment-methods",
    icon: CreditCard,
  },
  {
    name: "Delivery Dates",
    hash: "setting-delivery-dates",
    icon: Package,
  },
];
