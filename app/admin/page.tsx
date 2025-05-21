import React from "react";
import { db } from "@/database/drizzle";
import { books, users } from "@/database/schema";
import { count, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart, PieChart } from "@/components/charts/Charts";
import { 
  FiBook, 
  FiUsers, 
  FiClock, 
  FiTrendingUp,
  FiAward,
  FiStar
} from "react-icons/fi";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  createdAt: Date | null;
}

interface AuthCredentials {
  fullName: string;
  email: string;
  universityId: number;
  createdAt: Date | null;
}

const Page = async () => {
  const session = await auth();

  // Keep your original data fetching methods
  const [totalBooks, totalUsers] = await Promise.all([
    db.select({ count: count() }).from(books),
    db.select({ count: count() }).from(users),
  ]);

  const recentBooks = (await db
    .select()
    .from(books)
    .limit(5)
    .orderBy(desc(books.createdAt))) as Book[];

  const recentUsers = (await db
    .select()
    .from(users)
    .limit(5)
    .orderBy(desc(users.createdAt))) as AuthCredentials[];

  const booksByGenre = await db
    .select({ genre: books.genre, count: count() })
    .from(books)
    .groupBy(books.genre);

  // Calculate additional stats from existing data
  const availableBooksCount = recentBooks.reduce(
    (sum, book) => sum + (book.availableCopies || 0), 
    0
  );
  const utilizationRate = totalBooks[0].count > 0 
    ? Math.round(((totalBooks[0].count - availableBooksCount) / totalBooks[0].count) * 100)
    : 0;
  const topRatedBook = recentBooks.length > 0 
    ? [...recentBooks].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0]
    : null;

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Library Dashboard</h1>
          <p className="text-gray-500">Overview of your library management</p>
        </div>
        <div className="flex gap-3">
          <Button asChild className="gap-2 bg-primary-admin hover:bg-primary-admin/90 text-white">
            <Link href="/admin/books/new">
              <FiBook size={16} /> Add Book
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid - Enhanced */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Books"
          value={totalBooks[0].count}
          icon={<FiBook className="h-5 w-5 text-blue-500" />}
          change="+12% from last month"
          description="Books in collection"
        />
        <StatCard
          title="Available Books"
          value={availableBooksCount}
          icon={<FiBook className="h-5 w-5 text-green-500" />}
          change={`${utilizationRate}% in use`}
          description="Ready to borrow"
        />
        <StatCard
          title="Total Users"
          value={totalUsers[0].count}
          icon={<FiUsers className="h-5 w-5 text-purple-500" />}
          change="+5% from last month"
          description="Registered members"
        />
        <StatCard
          title="Top Rated"
          value={topRatedBook?.rating || 0}
          icon={<FiStar className="h-5 w-5 text-yellow-500" />}
          change={topRatedBook?.title || "N/A"}
          description="Highest rated book"
        />
      </div>

      {/* Charts Section - Enhanced */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FiBook className="text-blue-500" /> Books by Genre
            </CardTitle>
          </CardHeader>
          <CardContent className="w-[60%] mx-auto">
            <PieChart
              data={booksByGenre.map(g => ({
                name: g.genre,
                value: g.count,
              }))}
            />
          </CardContent>
        </Card>

        <Card className="border shadow-sm ">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FiTrendingUp className="text-green-500" /> Book Availability
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full border-red-300">
            <BarChart
              data={[
                { name: "Total", value: totalBooks[0].count },
                { name: "Available", value: availableBooksCount },
                { name: "In Use", value: totalBooks[0].count - availableBooksCount }
              ]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity - Enhanced */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FiClock className="text-blue-500" /> Recent Books
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/books">View All →</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBooks.map(book => (
                <div 
                  key={book.id} 
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div>
                    <h3 className="font-medium">{book.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{book.author}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <FiStar className="text-yellow-400 mr-1" size={14} />
                        {book.rating || 0}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">
                      {book.createdAt?.toLocaleDateString()}
                    </span>
                    <span className={`block text-xs mt-1 px-2 py-1 rounded-full ${
                      book.availableCopies > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {book.availableCopies} available
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FiUsers className="text-purple-500" /> New Users
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/users">View All →</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.map(user => (
                <div 
                  key={user.email} 
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div>
                    <h3 className="font-medium">{user.fullName}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="text-right">
                    {user.createdAt && (
                      <span className="text-sm text-gray-500">
                        {user.createdAt.toLocaleDateString()}
                      </span>
                    )}
                    <span className="block text-xs mt-1 text-gray-400">
                      ID: {user.universityId}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Enhanced StatCard component
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  change: string;
  description?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  change,
  description,
}: StatCardProps) => {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="p-2 rounded-lg bg-gray-100">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {/* <p className="text-sm text-gray-500 mt-1">
          <span className="text-green-500">{change}</span>
        </p> */}
        {description && (
          <p className="text-xs text-gray-400 mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Page;