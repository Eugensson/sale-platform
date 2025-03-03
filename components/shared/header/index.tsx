import Link from "next/link";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/shared/header/menu";
import { Search } from "@/components/shared/header/search";
import { Sidebar } from "@/components/shared/header/sidebar";

import data from "@/lib/data";

import { getAllCategories } from "@/lib/actions/product.actions";

export const Header = async () => {
  const categories = await getAllCategories();

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-gray-950 text-gray-50">
        <div className="container py-2 flex flex-col">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="hidden lg:block w-full lg:max-w-xl">
              <Search />
            </div>
            <Menu />
          </div>
          <div className="lg:hidden block py-1">
            <Search />
          </div>
        </div>
      </div>
      <div className="bg-gray-800 text-gray-50">
        <div className="container py-0.5 flex items-stretch">
          <Sidebar categories={categories} />
          <ul className="flex flex-wrap items-center overflow-hidden max-h-11">
            {data.headerMenus.map(({ href, name }) => (
              <li key={href}>
                <Button
                  variant="link"
                  type="button"
                  aria-label={name}
                  title={name}
                  className="text-gray-50"
                >
                  <Link href={href}>{name}</Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};
