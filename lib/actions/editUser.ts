"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Define validation schema
const UserSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address"),
  universityId: z.number().int().positive("University ID must be positive"),
  universityCard: z.string().trim().min(1, "University card is required"),
});

interface EditUserParams {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  universityCard: string;
}

export const editUser = async (params: EditUserParams) => {
  const { id, fullName, email, universityId, universityCard } = params;

  try {
    // Validate input
    const validation = UserSchema.safeParse({
      fullName,
      email,
      universityId,
      universityCard,
    });

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: errors,
      };
    }

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser.length) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Check if email is already taken by another user
    const emailExists = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (emailExists.length > 0 && emailExists[0].id !== id) {
      return {
        success: false,
        error: "Email already in use by another user",
        fieldErrors: {
          email: ["This email is already registered"],
        },
      };
    }

    // Update user in database
    const updatedUser = await db
      .update(users)
      .set({
        fullName,
        email,
        universityId,
        universityCard,
      })
      .where(eq(users.id, id))
      .returning();

    // Revalidate relevant paths
    revalidatePath("/admin/users");
    revalidatePath(`/profile/${email}`);

    return {
      success: true,
      data: updatedUser[0],
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      error: "An error occurred while updating the user",
    };
  }
};
