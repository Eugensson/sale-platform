"use server";

import { z } from "zod";
import { revalidatePath, unstable_cache } from "next/cache";

import { formatError } from "@/lib/utils";
import { PAGE_SIZE } from "@/lib/constants";
import { connectToDatabase } from "@/lib/db";
import { ProductInputSchema, ProductUpdateSchema } from "@/lib/validator";
import { getSetting } from "@/lib/actions/setting.actions";
import { IProduct, Product } from "@/lib/db/models/product.model";

import { IProductInput } from "@/types";

export const createProduct = async (data: IProductInput) => {
  try {
    const product = ProductInputSchema.parse(data);

    await connectToDatabase();

    await Product.create(product);

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const updateProduct = async (
  data: z.infer<typeof ProductUpdateSchema>
) => {
  try {
    const product = ProductUpdateSchema.parse(data);

    await connectToDatabase();

    await Product.findByIdAndUpdate(product._id, product);

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const getProductById = async (productId: string) => {
  await connectToDatabase();

  const product = await Product.findById(productId);

  return JSON.parse(JSON.stringify(product)) as IProduct;
};

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

export const getAllProducts = async ({
  query,
  limit,
  page,
  category,
  tag,
  price,
  rating,
  sort,
}: {
  query: string;
  category: string;
  tag: string;
  limit?: number;
  page: number;
  price?: string;
  rating?: string;
  sort?: string;
}) => {
  limit = limit || PAGE_SIZE;

  await connectToDatabase();

  const queryFilter =
    query && query !== "all"
      ? {
          name: {
            $regex: query,
            $options: "i",
          },
        }
      : {};

  const categoryFilter = category && category !== "all" ? { category } : {};

  const tagFilter = tag && tag !== "all" ? { tags: tag } : {};

  const ratingFilter =
    rating && rating !== "all"
      ? {
          avgRating: {
            $gte: Number(rating),
          },
        }
      : {};

  const priceFilter =
    price && price !== "all"
      ? {
          price: {
            $gte: Number(price.split("-")[0]),
            $lte: Number(price.split("-")[1]),
          },
        }
      : {};

  const order: Record<string, 1 | -1> =
    sort === "best-selling"
      ? { numSales: -1 }
      : sort === "price-low-to-high"
        ? { price: 1 }
        : sort === "price-high-to-low"
          ? { price: -1 }
          : sort === "avg-customer-review"
            ? { avgRating: -1 }
            : { _id: -1 };

  const isPublished = { isPublished: true };

  const products = await Product.find({
    ...isPublished,
    ...queryFilter,
    ...tagFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    .sort(order)
    .skip(limit * (Number(page) - 1))
    .limit(limit)
    .lean();

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...tagFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  });

  return {
    products: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(countProducts / limit),
    totalProducts: countProducts,
    from: limit * (Number(page) - 1) + 1,
    to: limit * (Number(page) - 1) + products.length,
  };
};

export const getAllTags = async () => {
  const tags = await Product.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: null, uniqueTags: { $addToSet: "$tags" } } },
    { $project: { _id: 0, uniqueTags: 1 } },
  ]);

  return (
    (tags[0]?.uniqueTags
      .sort((a: string, b: string) => a.localeCompare(b))
      .map((x: string) =>
        x
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      ) as string[]) || []
  );
};

export const deleteProduct = async (id: string) => {
  try {
    await connectToDatabase();
    const res = await Product.findByIdAndDelete(id);
    if (!res) throw new Error("Product not found");
    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const getAllProductsForAdmin = async ({
  query,
  page = 1,
  sort = "latest",
  limit = 10,
}: {
  query: string;
  page?: number;
  sort?: string;
  limit?: number;
}) => {
  await connectToDatabase();

  const {
    common: { pageSize },
  } = await getSetting();

  limit = limit || pageSize;

  const queryFilter =
    query && query !== "all"
      ? {
          name: {
            $regex: query,
            $options: "i",
          },
        }
      : {};

  const order: Record<string, 1 | -1> =
    sort === "best-selling"
      ? { numSales: -1 }
      : sort === "price-low-to-high"
        ? { price: 1 }
        : sort === "price-high-to-low"
          ? { price: -1 }
          : sort === "avg-customer-review"
            ? { avgRating: -1 }
            : { _id: -1 };

  const products = await Product.find({
    ...queryFilter,
  })
    .sort(order)
    .skip(limit * (Number(page) - 1))
    .limit(limit)
    .lean();

  const countProducts = await Product.countDocuments({
    ...queryFilter,
  });

  return {
    products: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(countProducts / pageSize),
    totalProducts: countProducts,
    from: pageSize * (Number(page) - 1) + 1,
    to: pageSize * (Number(page) - 1) + products.length,
  };
};
