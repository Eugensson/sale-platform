import Link from "next/link";
import { Metadata } from "next";
import { ListOrdered, MapPinHouse, ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { BrowsingHistoryList } from "@/components/shared/browsing-history-list";

const PAGE_TITLE = "Your Account";

export const metadata: Metadata = {
  title: PAGE_TITLE,
};

const AccountPage = () => {
  return (
    <div>
      <h1 className="py-4 text-xl">{PAGE_TITLE}</h1>
      <ul className="grid md:grid-cols-3 gap-4 items-stretch">
        <li>
          <Card className="relative h-full bg-muted backdrop-blur">
            <Link href="/account/orders">
              <CardContent className="flex flex-col gap-1 p-6">
                <ListOrdered className="size-6 text-muted-foreground absolute top-4 right-4" />
                <h2 className="text-lg">Orders</h2>
                <p className="text-sm text-muted-foreground">
                  Track, return, cancel an order, download invoice or buy again
                </p>
              </CardContent>
            </Link>
          </Card>
        </li>
        <li>
          <Card className="relative h-full bg-muted backdrop-blur">
            <Link href="/account/manage">
              <CardContent className="flex flex-col gap-1 p-6">
                <ShieldCheck className="size-6 text-muted-foreground absolute top-4 right-4" />
                <h2 className="text-lg ">Login & security</h2>
                <p className="text-sm text-muted-foreground">
                  Manage password, email and mobile number
                </p>
              </CardContent>
            </Link>
          </Card>
        </li>
        <li>
          <Card className="relative h-full bg-muted backdrop-blur">
            <Link href="/account/addresses">
              <CardContent className="flex flex-col gap-1 p-6">
                <MapPinHouse className="size-6 text-muted-foreground absolute top-4 right-4" />
                <h2 className="text-lg">Addresses</h2>
                <p className="text-sm text-muted-foreground">
                  Edit, remove or set default address
                </p>
              </CardContent>
            </Link>
          </Card>
        </li>
      </ul>
      <BrowsingHistoryList className="mt-16" />
    </div>
  );
};

export default AccountPage;
