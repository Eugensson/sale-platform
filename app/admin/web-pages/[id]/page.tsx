import Link from "next/link";
import { notFound } from "next/navigation";

import { WebPageForm } from "@/app/admin/web-pages/web-page-form";

import { getWebPageById } from "@/lib/actions/web-page.actions";

type UpdateWebPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const UpdateWebPage = async (props: UpdateWebPageProps) => {
  const { id } = await props.params;

  const webPage = await getWebPageById(id);

  if (!webPage) notFound();

  return (
    <main className="max-w-6xl mx-auto p-4">
      <div className="flex mb-4">
        <Link href="/admin/web-pages">Web Pages</Link>
        <span className="mx-1">›</span>
        <Link href={`/admin/web-pages/${webPage._id}`}>{webPage._id}</Link>
      </div>

      <div className="my-8">
        <WebPageForm type="Update" webPage={webPage} webPageId={webPage._id} />
      </div>
    </main>
  );
};

export default UpdateWebPage;
