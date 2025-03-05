"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { formatError } from "@/lib/utils";
import { connectToDatabase } from "@/lib/db";
import { WebPage, IWebPage } from "@/lib/db/models/web-page.model";
import { WebPageInputSchema, WebPageUpdateSchema } from "@/lib/validator";

export const createWebPage = async (
  data: z.infer<typeof WebPageInputSchema>
) => {
  try {
    const webPage = WebPageInputSchema.parse(data);

    await connectToDatabase();

    await WebPage.create(webPage);

    revalidatePath("/admin/web-pages");

    return {
      success: true,
      message: "WebPage created successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const updateWebPage = async (
  data: z.infer<typeof WebPageUpdateSchema>
) => {
  try {
    const webPage = WebPageUpdateSchema.parse(data);

    await connectToDatabase();

    await WebPage.findByIdAndUpdate(webPage._id, webPage);

    revalidatePath("/admin/web-pages");

    return {
      success: true,
      message: "WebPage updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const deleteWebPage = async (id: string) => {
  try {
    await connectToDatabase();

    const res = await WebPage.findByIdAndDelete(id);

    if (!res) throw new Error("WebPage not found");

    revalidatePath("/admin/web-pages");

    return {
      success: true,
      message: "WebPage deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const getAllWebPages = async () => {
  await connectToDatabase();

  const webPages = await WebPage.find();

  return JSON.parse(JSON.stringify(webPages)) as IWebPage[];
};

export const getWebPageById = async (webPageId: string) => {
  await connectToDatabase();

  const webPage = await WebPage.findById(webPageId);

  return JSON.parse(JSON.stringify(webPage)) as IWebPage;
};

export const getWebPageBySlug = async (slug: string) => {
  await connectToDatabase();

  const webPage = await WebPage.findOne({ slug, isPublished: true });

  if (!webPage) throw new Error("WebPage not found");

  return JSON.parse(JSON.stringify(webPage)) as IWebPage;
};
