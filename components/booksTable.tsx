"use client"

import { useState, useMemo } from "react";
import { FiEdit2, FiTrash2, FiChevronUp, FiChevronDown, FiSearch } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

interface BooksTableProps {
  books: Book[];
}

const BooksTable = ({ books: initialBooks }: BooksTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Book; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Filter and sort books
 // Filter and sort books
const filteredBooks = useMemo(() => {
  let filtered = initialBooks;
  
  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Apply sorting
  if (sortConfig !== null) {
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'ascending' ? 1 : -1;
      if (bValue == null) return sortConfig.direction === 'ascending' ? -1 : 1;
      
      // Compare non-null values
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }
  
  return filtered;
}, [initialBooks, searchTerm, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBooks.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredBooks]);

  const requestSort = (key: keyof Book) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const getSortIcon = (key: keyof Book) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <span className="opacity-0"><FiChevronUp /></span>;
    }
    return sortConfig.direction === 'ascending' ? 
      <FiChevronUp className="inline ml-1" /> : 
      <FiChevronDown className="inline ml-1" />;
  };

  return (
    <div className="w-full">
      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search books..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-admin focus:border-transparent"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {currentItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary-admin">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-primary-admin/90 transition-colors"
                    onClick={() => requestSort('title')}
                  >
                    Title {getSortIcon('title')}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-primary-admin/90 transition-colors"
                    onClick={() => requestSort('author')}
                  >
                    Author {getSortIcon('author')}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-primary-admin/90 transition-colors"
                    onClick={() => requestSort('genre')}
                  >
                    Genre {getSortIcon('genre')}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-primary-admin/90 transition-colors"
                    onClick={() => requestSort('rating')}
                  >
                    Rating {getSortIcon('rating')}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-primary-admin/90 transition-colors"
                    onClick={() => requestSort('totalCopies')}
                  >
                    Copies {getSortIcon('totalCopies')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{book.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{book.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-admin/10 text-primary-admin border border-primary-admin/20">
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
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No books match your search criteria." : "No books available yet."}
            </p>
            <Button className="mt-4 bg-primary-admin text-white" asChild>
              <Link href="/admin/books/new">Add New Book</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredBooks.length > itemsPerPage && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredBooks.length)}
            </span>{' '}
            of <span className="font-medium">{filteredBooks.length}</span> results
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg ${currentPage === page ? 'bg-primary-admin text-white' : 'border border-gray-300'}`}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksTable;