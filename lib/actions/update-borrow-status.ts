"use server";

import { db } from "@/database/drizzle";
import { borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface UpdateStatusParams {
  id: string;
  status: "PENDING" | "BORROWED" | "RETURNED";
}

export const editBorrowStatus = async ({ id, status }: UpdateStatusParams) => {
  const returnDate = status === "RETURNED" ? new Date().toISOString() : null;

  try {
    await db
      .update(borrowRecords)
      .set({
        status,
        returnDate,
      })
      .where(eq(borrowRecords.id, id));

    revalidatePath("/admin/borrow-records");

    return { success: true };
  } catch (error) {
    console.error("Error updating borrow status:", error);
    return { success: false, error: "Failed to update borrow record." };
  }
};
