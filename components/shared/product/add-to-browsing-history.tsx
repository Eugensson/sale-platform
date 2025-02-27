"use client";

import { useEffect } from "react";

import { useBrowsingHistory } from "@/hooks/use-browsing-history";

export const AddToBrowsingHistory = ({
  id,
  category,
}: {
  id: string;
  category: string;
}) => {
  const { addItem } = useBrowsingHistory();

  useEffect(() => {
    console.log("addItem({ id, category })");
    addItem({ id, category });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};
