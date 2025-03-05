"use server";

import { cookies } from "next/headers";

import { ISettingInput } from "@/types";

import data from "@/lib/data";
import { formatError } from "@/lib/utils";
import { connectToDatabase } from "@/lib/db";
import { Setting } from "@/lib/db/models/setting.model";

const globalForSettings = global as unknown as {
  cachedSettings: ISettingInput | null;
};

export const getNoCachedSetting = async (): Promise<ISettingInput> => {
  await connectToDatabase();

  const setting = await Setting.findOne();

  return JSON.parse(JSON.stringify(setting)) as ISettingInput;
};

export const getSetting = async (): Promise<ISettingInput> => {
  if (!globalForSettings.cachedSettings) {
    console.log("hit db");

    await connectToDatabase();

    const setting = await Setting.findOne().lean();

    globalForSettings.cachedSettings = setting
      ? JSON.parse(JSON.stringify(setting))
      : data.settings[0];
  }

  return globalForSettings.cachedSettings as ISettingInput;
};

export const updateSetting = async (newSetting: ISettingInput) => {
  try {
    await connectToDatabase();

    const updatedSetting = await Setting.findOneAndUpdate({}, newSetting, {
      upsert: true,
      new: true,
    }).lean();

    globalForSettings.cachedSettings = JSON.parse(
      JSON.stringify(updatedSetting)
    );

    return {
      success: true,
      message: "Setting updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const setCurrencyOnServer = async (newCurrency: string) => {
  "use server";

  const cookiesStore = await cookies();

  cookiesStore.set("currency", newCurrency);

  return {
    success: true,
    message: "Currency updated successfully",
  };
};
