"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

import { useDeviceType } from "@/hooks/use-device-type";

interface CollapsibleOnMobileProps {
  title: string;
  children: React.ReactNode;
}

export const CollapsibleOnMobile = ({
  title,
  children,
}: CollapsibleOnMobileProps) => {
  const deviceType = useDeviceType();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (deviceType === "mobile") setOpen(false);
    else if (deviceType === "desktop") setOpen(true);
  }, [deviceType, searchParams]);

  if (deviceType === "unknown") return null;

  return (
    <Collapsible open={open}>
      <CollapsibleTrigger asChild>
        {deviceType === "mobile" && (
          <Button
            onClick={() => setOpen(!open)}
            variant={"outline"}
            className="w-full"
          >
            {title}
          </Button>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
};
