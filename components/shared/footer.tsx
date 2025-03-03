import Link from "next/link";

import { BackToTop } from "@/components/shared/back-to-top";

import { APP_NAME } from "@/lib/constants";
import { Button } from "../ui/button";

export const Footer = () => {
  return (
    <footer className="bg-gray-950 text-muted underline-link">
      <BackToTop />
      <div className="py-4 container text-xs">
        <ul className="flex justify-center gap-1 md:gap-4 mb-2">
          <li>
            <Button variant="link" asChild className="p-0 text-gray-500">
              <Link href="/page/conditions-of-use">Conditions of Use</Link>
            </Button>
          </li>
          <li>
            <Button variant="link" asChild className="p-0 text-gray-500">
              <Link href="/page/privacy-policy" className="hover:underline">
                Privacy Notice
              </Link>
            </Button>
          </li>
          <li>
            <Button variant="link" asChild className="p-0 text-gray-500">
              <Link href="/page/help" className="hover:underline">
                Help
              </Link>
            </Button>
          </li>
        </ul>
        <p className="text-center text-gray-400 mb-6">
          &copy; 2025 {APP_NAME}, Inc.
        </p>
        <p className="text-center text-gray-400">
          123, Main Street, Anytown, CA, Zip 12345 | +1 (123) 456-7890
        </p>
      </div>
    </footer>
  );
};
