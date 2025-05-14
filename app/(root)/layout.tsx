import { ReactNode } from "react";
import Header from "@/components/Header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import Hero from "@/components/Hero";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session) redirect("/sign-in");

  after(async () => {
    if (!session?.user?.id) return;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session?.user?.id))
      .limit(1);

    if (user[0].lastActivityDate === new Date().toISOString().slice(0, 10))
      return;

    await db
      .update(users)
      .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
      .where(eq(users.id, session?.user?.id));
  });

  return (
    <main className="root-container">
      <div className="w-full bg-hero ">
        <div className="min-h-screen h-screen bg-[linear-gradient(to_top,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.4)_60%,rgba(0,0,0,0.8)_100%)]">
          <div className="mx-auto max-w-[1200px] w-full h-full">
            <div className="absolute max-w-[1200px] w-full">
              <Header session={session} />
            </div>
            <Hero/>
          </div>
        </div>
      </div>

      {/* children */}
      <div className="mx-auto max-w-[1200px] w-full ">
        <div className="mt-20 pb-20 mx-[15px]">{children}</div>
      </div>
      
    </main>
  );
};

export default Layout;
