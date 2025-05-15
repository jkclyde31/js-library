import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { db } from "@/database/drizzle";
import { books, users } from "@/database/schema";
import { auth } from "@/auth";
import { desc } from "drizzle-orm";
import LatestRelease from "../home-sections/LatestRelease";
import Popular from "../home-sections/Popular";
import CategoryBrowser from "@/components/CategoryBrowser";
import Hero from "@/components/Hero";

const Home = async () => {
  const session = await auth();

  const latestBooks = (await db
    .select()
    .from(books)
    .limit(10)
    .orderBy(desc(books.createdAt))) as Book[];

  return (
    <>
    
      <LatestRelease/>
      <Popular/>
      <CategoryBrowser/>
    </>
  );
};

export default Home;
