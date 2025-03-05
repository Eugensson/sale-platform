import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { UserEditForm } from "@/app/admin/users/[id]/user-edit-form";

import { getUserById } from "@/lib/actions/user.actions";

export const metadata: Metadata = {
  title: "Edit User",
};

const UserEditPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;

  const user = await getUserById(id);

  if (!user) notFound();

  return (
    <main className="max-w-6xl mx-auto p-4">
      <div className="flex mb-4">
        <Link href="/admin/users">Users</Link>
        <span className="mx-1">›</span>
        <Link href={`/admin/users/${user._id}`}>{user._id}</Link>
      </div>

      <div className="my-8">
        <UserEditForm user={user} />
      </div>
    </main>
  );
};

export default UserEditPage;
