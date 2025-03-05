"use client";

import Link from "next/link";
import { DateRange } from "react-day-picker";
import { useEffect, useState, useTransition } from "react";
import { BadgeDollarSign, Barcode, CreditCard, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { TableChart } from "@/app/admin/overview/table-chart";
import { SalesAreaChart } from "@/app/admin/overview/sales-area-chart";
import { ProductPrice } from "@/components/shared/product/product-price";
import { CalendarDateRangePicker } from "@/app/admin/overview/date-range-picker";
import { SalesCategoryPieChart } from "@/app/admin/overview/sales-category-pie-chart";

import { IOrderList } from "@/types";

import { getOrderSummary } from "@/lib/actions/order.actions";
import { calculatePastDate, formatDateTime, formatNumber } from "@/lib/utils";

export const OverviewReport = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: calculatePastDate(30),
    to: new Date(),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<{ [key: string]: any }>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (date) {
      startTransition(async () => {
        setData(await getOrderSummary(date));
      });
    }
  }, [date]);

  if (!data)
    return (
      <div className="space-y-4">
        <h1 className="text-2xl">Dashboard</h1>
        <div className="flex gap-4">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-36 w-full" />
          ))}
        </div>
        <Skeleton className="h-[30rem] w-full" />
        <div className="flex gap-4">
          {[...Array(2)].map((_, index) => (
            <Skeleton key={index} className="h-60 w-full" />
          ))}
        </div>
        <div className="flex gap-4">
          {[...Array(2)].map((_, index) => (
            <Skeleton key={index} className="h-60 w-full" />
          ))}
        </div>
      </div>
    );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Dashboard</h1>
        <CalendarDateRangePicker defaultDate={date} setDate={setDate} />
      </div>
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <li>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium">Total Revenue</CardTitle>
              <BadgeDollarSign className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                <ProductPrice price={data.totalSales} plain />
              </div>
              <Link className="text-sm hover:underline" href="/admin/orders">
                View revenue
              </Link>
            </CardContent>
          </Card>
        </li>
        <li>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium">Sales</CardTitle>
              <CreditCard className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {formatNumber(data.ordersCount)}
              </div>
              <Link className="text-sm hover:underline" href="/admin/orders">
                View orders
              </Link>
            </CardContent>
          </Card>
        </li>
        <li>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium">Customers</CardTitle>
              <Users className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{data.usersCount}</div>
              <Link className="text-sm hover:underline" href="/admin/users">
                View customers
              </Link>
            </CardContent>
          </Card>
        </li>
        <li>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium">Products</CardTitle>
              <Barcode className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {data.productsCount}
              </div>
              <Link className="text-sm hover:underline" href="/admin/products">
                Products
              </Link>
            </CardContent>
          </Card>
        </li>
      </ul>
      <ul className="grid md:grid-cols-2 gap-4">
        <li className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesAreaChart data={data.salesChartData} />
            </CardContent>
          </Card>
        </li>
        <li>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>How much you’re earning</CardTitle>
              <CardDescription>Estimated · Last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <TableChart data={data.monthlySales} labelType="month" />
            </CardContent>
          </Card>
        </li>
        <li>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>
                {formatDateTime(date!.from!).dateOnly} to{" "}
                {formatDateTime(date!.to!).dateOnly}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TableChart data={data.topSalesProducts} labelType="product" />
            </CardContent>
          </Card>
        </li>
        <li>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Best-Selling Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesCategoryPieChart data={data.topSalesCategories} />
            </CardContent>
          </Card>
        </li>
        <li>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.latestOrders.map((order: IOrderList) => (
                    <TableRow key={order._id}>
                      <TableCell>
                        {order.user ? order.user.name : "Deleted User"}
                      </TableCell>

                      <TableCell>
                        {formatDateTime(order.createdAt).dateOnly}
                      </TableCell>
                      <TableCell>
                        <ProductPrice price={order.totalPrice} plain />
                      </TableCell>

                      <TableCell>
                        <Link href={`/admin/orders/${order._id}`}>
                          <span className="px-2">Details</span>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </li>
      </ul>
    </section>
  );
};
