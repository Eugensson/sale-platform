import Link from "next/link";
import { Metadata } from "next";

import { ProductForm } from "@/app/admin/products/product-form";

export const metadata: Metadata = {
  title: "Create Product",
};

const CreateProduct = () => {
  return (
    <main className="max-w-6xl mx-auto p-4">
      <div className="flex mb-4">
        <Link href="/admin/products">Products</Link>
        <span className="mx-1">›</span>
        <Link href="/admin/products/create">Create</Link>
      </div>

      <div className="my-8">
        <ProductForm type="Create" />
      </div>
    </main>
  );
};

export default CreateProduct;
