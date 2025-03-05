import { Logo } from "@/components/logo";
import { AdminNav } from "@/app/admin/admin-nav";
import { Menu } from "@/components/shared/header/menu";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <div className="bg-gray-950 text-gray-50">
        <div className="px-4 flex h-16 items-center">
          <Logo />
          <AdminNav className="mx-12 hidden lg:flex" />
          <Menu forAdmin className="ml-auto" />
        </div>
        <AdminNav className="flex lg:hidden p-2 md:p-4 border-t border-muted-foreground" />
      </div>
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
};

export default AdminLayout;
