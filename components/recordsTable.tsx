"use client";

import { useState, useMemo } from "react";
import { FiEdit2, FiTrash2, FiChevronUp, FiChevronDown, FiSearch } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BorrowBookParams {
  id:string;
  bookId: string;
  userId: string;
  borrowDate: Date | string | null;
  dueDate: Date | string | null;
  returnDate: Date | string | null;
  status: string;
}

interface AuthCredentials {
  id: string
  fullName: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverColor: string;
  coverUrl: string;
  videoUrl: string;
  summary: string;
  createdAt: Date | null;
}



interface BorrowRecordsTableProps {
  records: BorrowBookParams[];
  users:AuthCredentials[];
  books:Book[];
}



const BorrowRecordsTable = ({ records, users, books }: BorrowRecordsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof BorrowBookParams;
    direction: "ascending" | "descending";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.fullName : "Unknown User";
  };

  const getBookName = (bookId: string) => {
    const book = books.find((u) => u.id === bookId);
    return book ? book.title : "Unknown Book";
  };

  const filteredRecords = useMemo(() => {
    let filtered = records;

   if (searchTerm) {
  const lowerSearch = searchTerm.toLowerCase();
  filtered = filtered.filter((record) => {
    const userName = getUserName(record.userId).toLowerCase();
    const bookName = getBookName(record.bookId).toLowerCase();
    const combinedValues = [
      userName,
      bookName,
      record.borrowDate,
      record.dueDate,
      record.returnDate,
      record.status
    ]
      .map((val) => (val ? val.toString().toLowerCase() : ""))
      .join(" ");

    return combinedValues.includes(lowerSearch);
  });
}


    if (sortConfig !== null) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortConfig.direction === "ascending" ? 1 : -1;
        if (bValue == null) return sortConfig.direction === "ascending" ? -1 : 1;

        return String(aValue).localeCompare(String(bValue)) *
          (sortConfig.direction === "ascending" ? 1 : -1);
      });
    }

    return filtered;
  }, [records, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRecords, currentPage]);

 const requestSort = (key: keyof BorrowBookParams) => {
  let direction: "ascending" | "descending" = "ascending";
  if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
    direction = "descending";
  }
  setSortConfig({ key, direction });
  setCurrentPage(1);
};

const getSortIcon = (key: keyof BorrowBookParams) => {
  if (!sortConfig || sortConfig.key !== key) {
    return <span className="opacity-0"><FiChevronUp /></span>;
  }
  return sortConfig.direction === "ascending" ? (
    <FiChevronUp className="inline ml-1" />
  ) : (
    <FiChevronDown className="inline ml-1" />
  );
};


  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search borrow records..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-admin focus:border-transparent"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {currentItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary-admin text-white">
                <tr>
                   <th
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("id")}
                  >
                    Request ID {getSortIcon("id")}
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("userId")}
                  >
                    User Name {getSortIcon("userId")}
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("bookId")}
                  >
                    Book Name {getSortIcon("bookId")}
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("borrowDate")}
                  >
                    Borrow Date {getSortIcon("borrowDate")}
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("dueDate")}
                  >
                    Due Date {getSortIcon("dueDate")}
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("returnDate")}
                  >
                    Return Date {getSortIcon("returnDate")}
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("status")}
                  >
                    Status {getSortIcon("status")}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((record) => (
                  <tr key={`${record.bookId}-${record.userId}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getUserName(record.userId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getBookName(record.bookId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.borrowDate
                        ? new Date(record.borrowDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.dueDate
                        ? new Date(record.dueDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.returnDate
                        ? new Date(record.returnDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <button className="text-blue-600 hover:text-blue-900">
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
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
            <p className="text-gray-500 text-lg">
              {searchTerm
                ? "No borrow records match your search."
                : "No borrow records available."}
            </p>
            <Button className="mt-4 bg-primary-admin text-white" asChild>
              <Link href="/admin/borrow-records/new">Add New Record</Link>
            </Button>
          </div>
        )}
      </div>

      {filteredRecords.length > itemsPerPage && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredRecords.length)}
            </span>{" "}
            of <span className="font-medium">{filteredRecords.length}</span>{" "}
            results
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "bg-primary-admin text-white" : ""}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowRecordsTable;