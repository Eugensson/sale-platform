import { Metadata } from "next";

import { ProductList } from "@/app/admin/products/product-list";

export const metadata: Metadata = {
  title: "Admin Products",
};

const AdminProduct = async () => {
  return <ProductList />;
};

export default AdminProduct;
