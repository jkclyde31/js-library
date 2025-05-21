"use client"

import { useState, useMemo } from "react";
import { FiEdit2, FiTrash2, FiChevronUp, FiChevronDown, FiSearch, FiX } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { editUser } from "@/lib/actions/editUser";
import { toast } from "@/hooks/use-toast";

interface AuthCredentials {
  id:string;
  fullName: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
}

interface UsersTableProps {
  users: AuthCredentials[];
}

const UsersTable = ({ users: initialUsers }: UsersTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ 
    key: keyof AuthCredentials; 
    direction: 'ascending' | 'descending' 
  } | null>(null);
  const [editingUser, setEditingUser] = useState<AuthCredentials | null>(null);
  const [users, setUsers] = useState<AuthCredentials[]>(initialUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingUser) return;
    
    const { name, value } = e.target;
    setEditingUser({
      ...editingUser,
      [name]: name === 'universityId' ? Number(value) : value
    });
  };

  // HANDLE SUBMIT ===========================================================

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    try {
const result = await editUser(editingUser);
      
      if (result.success) {
        setUsers(users.map(user => 
          user.email === editingUser.email ? editingUser : user
        ));
        toast({
          title: "Success",
          description: "User updated successfully",
        });
        setEditingUser(null);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update user",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.universityId.toString().includes(searchTerm)
      );
    }
    
    if (sortConfig !== null) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortConfig.direction === 'ascending' ? 1 : -1;
        if (bValue == null) return sortConfig.direction === 'ascending' ? -1 : 1;
        
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
  }, [users, searchTerm, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredUsers]);

  const requestSort = (key: keyof AuthCredentials) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const getSortIcon = (key: keyof AuthCredentials) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <span className="opacity-0"><FiChevronUp /></span>;
    }
    return sortConfig.direction === 'ascending' ? 
      <FiChevronUp className="inline ml-1" /> : 
      <FiChevronDown className="inline ml-1" />;
  };

  return (
    <div className="w-full">
      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Edit User</h2>
                <button 
                  onClick={() => setEditingUser(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={editingUser.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-admin"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editingUser.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-admin"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">University ID</label>
                    <input
                      type="number"
                      name="universityId"
                      value={editingUser.universityId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-admin"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">University Card URL</label>
                    <input
                      type="text"
                      name="universityCard"
                      value={editingUser.universityCard}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-admin"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary-admin text-white px-4 py-2"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
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
                    onClick={() => requestSort('fullName')}
                  >
                    Name {getSortIcon('fullName')}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-primary-admin/90 transition-colors"
                    onClick={() => requestSort('email')}
                  >
                    Email {getSortIcon('email')}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-primary-admin/90 transition-colors"
                    onClick={() => requestSort('universityId')}
                  >
                    University ID {getSortIcon('universityId')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    University Card
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((user) => (
                  <tr key={user.email} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{user.fullName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.universityId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.universityCard ? (
                        <a 
                          href={user.universityCard} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Card
                        </a>
                      ) : (
                        <span className="text-gray-400">Not available</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => setEditingUser(user)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
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
              {searchTerm ? "No users match your search criteria." : "No users available yet."}
            </p>
            <Button className="mt-4 bg-primary-admin text-white" asChild>
              <Link href="/admin/users/new">Add New User</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredUsers.length > itemsPerPage && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
            </span>{' '}
            of <span className="font-medium">{filteredUsers.length}</span> results
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

export default UsersTable;