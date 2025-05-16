import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc } from "drizzle-orm";
import { auth } from "@/auth";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const Page = async () => {
  const session = await auth();

  const allBooks = (await db
    .select()
    .from(books)
    .orderBy(desc(books.createdAt))) as Book[];

  return (
    <section className="w-full rounded-2xl bg-white p-7 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
        {/* <Button className="bg-primary-admin hover:bg-primary-admin/90 text-white px-6 py-3 rounded-lg shadow-sm" asChild>
          <Link href="/admin/books/new">+ Create New Book</Link>
        </Button> */}
      </div>

      <div className="mt-8 w-full overflow-x-auto">
        {allBooks.length > 0 ? (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary-admin">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Author</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Genre</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Copies</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{book.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{book.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-admin text-white">
                        {book.genre}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-yellow-500 font-medium">{book.rating}</span>
                        <svg className="w-4 h-4 ml-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{book.totalCopies}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-3">
                        <button className="text-blue-600 hover:text-blue-900 transition-colors">
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 transition-colors">
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-500 text-lg">No books available yet.</p>
            <Button className="mt-4 bg-primary-admin text-white" asChild>
              <Link href="/admin/books/new">Add Your First Book</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Page;