import { Metadata } from "next";

import { SettingNav } from "@/app/admin/settings/setting-nav";
import { SettingForm } from "@/app/admin/settings/setting-form";

import { getNoCachedSetting } from "@/lib/actions/setting.actions";

export const metadata: Metadata = {
  title: "Setting",
};

const SettingPage = async () => {
  return (
    <div className="grid md:grid-cols-5 max-w-6xl mx-auto gap-4">
      <SettingNav />
      <main className="col-span-4">
        <div className="my-8">
          <SettingForm setting={await getNoCachedSetting()} />
        </div>
      </main>
    </div>
  );
};

export default SettingPage;
