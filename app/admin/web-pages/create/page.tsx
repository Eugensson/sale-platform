import { Metadata } from "next";

import { WebPageForm } from "@/app/admin/web-pages/web-page-form";

export const metadata: Metadata = {
  title: "Create WebPage",
};

const CreateWebPage = () => {
  return (
    <>
      <h1 className="h1-bold">Create WebPage</h1>

      <div className="my-8">
        <WebPageForm type="Create" />
      </div>
    </>
  );
};

export default CreateWebPage;
