import { ReactNode } from "react";
import Header from "@/components/Header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import HeroContainer from "../home-sections/HeroSection";
import Footer from "@/components/Footer";

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
    if (user[0].lastActivityDate === new Date().toISOString().slice(0, 10)) return;
    await db
      .update(users)
      .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
      .where(eq(users.id, session?.user?.id));
  });

  return (
    <main className="root-container">
      {/* MAIN BACKGROUND CONTAINER (PATTERN + GRADIENT) */}
      <div 
        className="bg-cover bg-center bg-no-repeat bg-fixed w-full min-h-screen"
        style={{ backgroundImage: "url('/images/pattern.webp')" }}
      >
        {/* HEADER SECTION (ABSOLUTE POSITIONED) */}
        <div className="absolute top-0 left-0 w-full z-20">
          <div className="mx-auto max-w-[1200px] w-full">
            <Header session={session} />
          </div>
        </div>

        {/* HERO SECTION WITH GRADIENT OVERLAY */}
       <HeroContainer/>

        {/* MAIN CONTENT SECTION */}
        <div className="relative z-10 pt-[15px]">
          <div className="mx-auto max-w-[1200px] w-full">
            <div className="pb-[25px] mx-[15px]">
              {children}
            </div>
          </div>
        </div>

        <Footer/>
      </div>
    </main>
  );
};

export default Layout;