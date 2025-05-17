import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc } from "drizzle-orm";
import { auth } from "@/auth";
import BooksTable from "@/components/booksTable";

const Page = async () => {
  const session = await auth();

  const allBooks = (await db
    .select()
    .from(books)
    .orderBy(desc(books.createdAt))) as Book[];

  return (
    <section className="w-full rounded-2xl bg-white p-7 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">All Books</h2>
        <Button className="bg-primary-admin hover:bg-primary-admin/90 text-white px-6 py-3 rounded-lg shadow-sm" asChild>
          <Link href="/admin/books/new">+ Create New Book</Link>
        </Button>
      </div>

      <div className="mt-8 w-full overflow-x-auto">
        <BooksTable books={allBooks}/>
      </div>
    </section>
  );
};

export default Page;