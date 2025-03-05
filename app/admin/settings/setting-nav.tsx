"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { ADMIN_SETTINGS_NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const SettingNav = () => {
  const [active, setActive] = useState("");

  useEffect(() => {
    const sections = document.querySelectorAll('div[id^="setting-"]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.6, rootMargin: "0px 0px -40% 0px" }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleScroll = (id: string) => {
    const section = document.getElementById(id);

    if (section) {
      const top = section.offsetTop - 16; // 20px above the section
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div>
      <h1 className="h1-bold">Setting</h1>
      <nav className="flex md:flex-col gap-2 md:fixed mt-4 flex-wrap">
        {ADMIN_SETTINGS_NAV_LINKS.map(({ name, hash, icon: Icon }) => (
          <Button
            onClick={() => handleScroll(hash)}
            key={hash}
            variant={active === hash ? "outline" : "ghost"}
            className={cn(
              "justify-start items-center gap-4 [&_svg]:size-5 hover:bg-muted",
              active === hash && "bg-muted"
            )}
          >
            <Icon className="text-muted-foreground" />
            {name}
          </Button>
        ))}
      </nav>
    </div>
  );
};
