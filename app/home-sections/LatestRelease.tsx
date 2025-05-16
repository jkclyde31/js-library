import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { db } from "@/database/drizzle";
import { books, users } from "@/database/schema";
import { auth } from "@/auth";
import { desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";


const LatestRelease = async () => {
  const latestBooks = (await db
    .select()
    .from(books)
    .limit(20)
    .orderBy(desc(books.createdAt))) as Book[];

  return (
    <>
      {/* <BookOverview {...latestBooks[0]} userId={session?.user?.id as string} /> */}

      <BookList
        title="Latest Books"
        books={latestBooks}
        containerClassName="mt-28"
      />
    </>

 
  );
};

export default LatestRelease;
