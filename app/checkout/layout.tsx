import Link from "next/link";
import { HelpCircle } from "lucide-react";

import { Logo } from "@/components/logo";

const CheckoutLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-6xl mx-auto flex flex-col min-h-screen">
      <header className="flex items-center justify-between py-4 border-b">
        <Logo className="text-sky-700 hover:text-orange-700" />
        <h1 className="text-3xl">Checkout</h1>
        <Link href="/page/help" title="Help Center" aria-label="Help Center">
          <HelpCircle size={24} />
        </Link>
      </header>
      {children}
    </div>
  );
};

export default CheckoutLayout;
