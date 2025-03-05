"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import MdEditor from "react-markdown-editor-lite";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { toSlug } from "@/lib/utils";
import { IWebPage } from "@/lib/db/models/web-page.model";
import { WebPageInputSchema, WebPageUpdateSchema } from "@/lib/validator";
import { createWebPage, updateWebPage } from "@/lib/actions/web-page.actions";

import "react-markdown-editor-lite/lib/index.css";

const webPageDefaultValues =
  process.env.NODE_ENV === "development"
    ? {
        title: "Sample Page",
        slug: "sample-page",
        content: "Sample Content",
      }
    : {
        title: "",
        slug: "",
        content: "",
      };

interface WebPageFormProps {
  type: "Create" | "Update";
  webPage?: IWebPage;
  webPageId?: string;
}

export const WebPageForm = ({ type, webPage, webPageId }: WebPageFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof WebPageInputSchema>>({
    resolver:
      type === "Update"
        ? zodResolver(WebPageUpdateSchema)
        : zodResolver(WebPageInputSchema),
    defaultValues:
      webPage && type === "Update" ? webPage : webPageDefaultValues,
  });

  const onSubmit = async (values: z.infer<typeof WebPageInputSchema>) => {
    if (type === "Create") {
      const res = await createWebPage(values);
      if (!res.success) {
        toast(res.message);
      } else {
        toast(res.message);
        router.push(`/admin/web-pages`);
      }
    }
    if (type === "Update") {
      if (!webPageId) {
        router.push(`/admin/web-pages`);
        return;
      }
      const res = await updateWebPage({ ...values, _id: webPageId });
      if (!res.success) {
        toast(res.message);
      } else {
        router.push(`/admin/web-pages`);
      }
    }
  };

  return (
    <Form {...form}>
      <form
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>

                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter slug"
                      className="pl-8"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        form.setValue("slug", toSlug(form.getValues("title")));
                      }}
                      className="absolute right-2 top-2.5"
                    >
                      Generate
                    </button>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <MdEditor
                    // value={markdown}
                    {...field}
                    style={{ height: "500px" }}
                    renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
                    onChange={({ text }) => form.setValue("content", text)}
                  />

                  {/* <Textarea placeholder='Enter content' {...field} /> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="space-x-2 items-center">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Is Published?</FormLabel>
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            {form.formState.isSubmitting ? "Submitting..." : `${type} Page `}
          </Button>
        </div>
      </form>
    </Form>
  );
};
