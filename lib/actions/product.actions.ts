"use server";

import { unstable_cache } from "next/cache";

import { PAGE_SIZE } from "@/lib/constants";
import { connectToDatabase } from "@/lib/db";
import { IProduct, Product } from "@/lib/db/models/product.model";

export const getAllCategories = async () => {
  await connectToDatabase();

  const categories = await Product.find({ isPublished: true }).distinct(
    "category"
  );

  return categories;
};

export const getProductsForCard = async ({
  tag,
  limit = 4,
}: {
  tag: string;
  limit?: number;
}) => {
  await connectToDatabase();
  const products = await Product.find(
    { tags: { $in: [tag] }, isPublished: true },
    {
      name: 1,
      href: { $concat: ["/product/", "$slug"] },
      image: { $arrayElemAt: ["$images", 0] },
    }
  )
    .sort({ createdAt: "desc" })
    .limit(limit);
  return JSON.parse(JSON.stringify(products)) as {
    name: string;
    href: string;
    image: string;
  }[];
};

export const getProductsByTag = async ({
  tag,
  limit = 10,
}: {
  tag: string;
  limit?: number;
}) => {
  await connectToDatabase();

  const products = await Product.find({
    tags: { $in: [tag] },
    isPublished: true,
  })
    .sort({ createdAt: "desc" })
    .limit(limit);
  return JSON.parse(JSON.stringify(products)) as IProduct[];
};

export const getProductBySlug = async (slug: string) => {
  await connectToDatabase();
  const product = await Product.findOne({ slug, isPublished: true });
  if (!product) throw new Error("Product not found");
  return JSON.parse(JSON.stringify(product)) as IProduct;
};

export const getRelatedProductsByCategory = async ({
  category,
  productId,
  limit = PAGE_SIZE,
  page = 1,
}: {
  category: string;
  productId: string;
  limit?: number;
  page: number;
}) => {
  await connectToDatabase();
  const skipAmount = (Number(page) - 1) * limit;
  const conditions = {
    isPublished: true,
    category,
    _id: { $ne: productId },
  };
  const products = await Product.find(conditions)
    .sort({ numSales: "desc" })
    .skip(skipAmount)
    .limit(limit);
  const productsCount = await Product.countDocuments(conditions);
  return {
    data: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(productsCount / limit),
  };
};

export const getHomePageData = unstable_cache(
  async () => {
    const [categories, newArrivals, featureds, bestSellers] = await Promise.all(
      [
        getAllCategories(),
        getProductsForCard({ tag: "new-arrival", limit: 4 }),
        getProductsForCard({ tag: "featured", limit: 4 }),
        getProductsForCard({ tag: "best-seller", limit: 4 }),
      ]
    );

    return {
      categories: categories.slice(0, 4),
      newArrivals,
      featureds,
      bestSellers,
    };
  },
  ["home-data"],
  { revalidate: 300 }
);
