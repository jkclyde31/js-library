// import React from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { db } from "@/database/drizzle";
// import { borrowRecords } from "@/database/schema";
// import { desc } from "drizzle-orm";
// import { auth } from "@/auth";
// import UsersTable from "@/components/UsersTable";

// const Page = async () => {
//   const session = await auth();
//   const allUsers = (await db
//     .select()
//     .from(borrowRecords)
//     .orderBy(desc(borrowRecords.createdAt))) as BorrowBookParams[];

//   return (
//     <section className="w-full rounded-2xl bg-white p-7 shadow-sm">
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <h2 className="text-2xl font-bold text-gray-800">All Books</h2>
//         <Button className="bg-primary-admin hover:bg-primary-admin/90 text-white px-6 py-3 rounded-lg shadow-sm" asChild>
//           <Link href="/admin/books/new">+ Create New Book</Link>
//         </Button>
//       </div>

//       <div className="mt-8 w-full overflow-x-auto">
//         <UsersTable users={allUsers}/>
//       </div>
//     </section>
//   );
// };

// export default Page;

import React from 'react'

const page = () => {
  return (
    <div>Under Maintenance......</div>
  )
}

export default page