"use server";

import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface EditBookParams {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  description?: string;
  coverColor?: string;
  coverUrl?: string;
  videoUrl?: string;
  summary?: string;
}

export const editBook = async (params: EditBookParams) => {
  const {
    id,
    title,
    author,
    genre,
    rating,
    totalCopies,
    availableCopies,
    description = "",
    coverColor = "",
    coverUrl = "",
    videoUrl = "",
    summary = ""
  } = params;

  try {
    // Validate available copies doesn't exceed total copies
    if (availableCopies > totalCopies) {
      return {
        success: false,
        error: "Available copies cannot exceed total copies",
      };
    }

    // Validate rating is between 0 and 5
    if (rating < 0 || rating > 5) {
      return {
        success: false,
        error: "Rating must be between 0 and 5",
      };
    }

    const updatedBook = await db.update(books)
      .set({
        title,
        author,
        genre,
        rating,
        totalCopies,
        availableCopies,
        description,
        coverColor,
        coverUrl,
        summary,
      })
      .where(eq(books.id, id))
      .returning();

    // Revalidate any pages that might be showing this book data
    revalidatePath("/admin/books");
    revalidatePath(`/books/${id}`);

    return {
      success: true,
      data: updatedBook[0],
    };
  } catch (error) {
    console.error("Error updating book:", error);
    
    return {
      success: false,
      error: "An error occurred while updating the book",
    };
  }
};