import { Metadata } from "next";

import { OverviewReport } from "@/app/admin/overview/overview-report";

import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const Dashboard = async () => {
  const session = await auth();

  if (session?.user.role !== "Admin")
    throw new Error("Admin permission required");

  return <OverviewReport />;
};

export default Dashboard;
