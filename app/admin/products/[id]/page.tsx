import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductForm } from "@/app/admin/products/product-form";

import { getProductById } from "@/lib/actions/product.actions";

export const metadata: Metadata = {
  title: "Edit Product",
};

type UpdateProductProps = {
  params: Promise<{
    id: string;
  }>;
};

const UpdateProduct = async (props: UpdateProductProps) => {
  const { id } = await props.params;

  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <main className="max-w-6xl mx-auto p-4">
      <div className="flex mb-4">
        <Link href="/admin/products">Products</Link>
        <span className="mx-1">›</span>
        <Link href={`/admin/products/${product._id}`}>{product._id}</Link>
      </div>

      <div className="my-8">
        <ProductForm type="Update" product={product} productId={product._id} />
      </div>
    </main>
  );
};

export default UpdateProduct;
