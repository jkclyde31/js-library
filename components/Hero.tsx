import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { db } from "@/database/drizzle";
import { books, users } from "@/database/schema";
import { auth } from "@/auth";
import { desc } from "drizzle-orm";
import { Button } from "./ui/button";

const Hero = async () => {
  const session = await auth();

  const latestBooks = (await db
    .select()
    .from(books)
    .limit(10)
    .orderBy(desc(books.createdAt))) as Book[];

  return (
    // <>
    //   <BookOverview {...latestBooks[0]} userId={session?.user?.id as string} />

    //   <BookList
    //     title="Latest Books"
    //     books={latestBooks}
    //     containerClassName="mt-28"
    //   />
    // </>

    <div className="flex flex-col justify-center items-center text-white h-[100%]">
        <h1 className="text-5xl font-bold mb-4 ">Unlimited Books, Magazines & More</h1>
        <p className="text-xl mb-8">Read Anywhere</p>
        <Button className="bg-white text-black px-6 py-[25px] rounded font-bold flex items-center justify-center hover:bg-opacity-80 hover:bg-white">
            Browse Collection
        </Button>
    </div>
  );
};

export default Hero;
