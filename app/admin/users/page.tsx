import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { desc } from "drizzle-orm";
import { auth } from "@/auth";
import UsersTable from "@/components/UsersTable";

const Page = async () => {
  const session = await auth();
  const allUsers = (await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt))) as AuthCredentials[];

  return (
    <section className="w-full rounded-2xl bg-white p-7 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
      </div>

      <div className="mt-8 w-full overflow-x-auto">
        <UsersTable users={allUsers}/>
      </div>
    </section>
  );
};

export default Page;