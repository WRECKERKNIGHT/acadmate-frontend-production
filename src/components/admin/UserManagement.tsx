import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  BookOpen,
  GraduationCap,
  Shield,
  X,
  Save,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react'
import { adminAPI } from '../../config/api'
import toast from 'react-hot-toast'

interface User {
  id: string
  uid: string
  fullName: string
  role: 'STUDENT' | 'TEACHER' | 'HEAD_TEACHER'
  batchType?: string
  subjects?: string
  roomNumber?: string
  phone?: string
  address?: string
  dateOfBirth?: string
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  _count?: {
    testsCreated: number
    submissions: number
    doubts: number
    homeworkAssigned: number
    homeworkSubmissions: number
  }
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  
  // Filters
  const [filters, setFilters] = useState({
    role: '',
    batchType: '',
    isActive: '',
    search: '',
    page: 1,
    limit: 20
  })

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 20
  })

  useEffect(() => {
    loadUsers()
  }, [filters])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllUsers(filters)
      setUsers(response.data.users)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (userData: any) => {
    try {
      await adminAPI.createUser(userData)
      toast.success('User created successfully!')
      setShowCreateModal(false)
      loadUsers()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create user')
    }
  }

  const handleUpdateUser = async (userId: string, userData: any) => {
    try {
      await adminAPI.updateUser(userId, userData)
      toast.success('User updated successfully!')
      setShowEditModal(false)
      setSelectedUser(null)
      loadUsers()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update user')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await adminAPI.deleteUser(userId)
      toast.success('User deactivated successfully!')
      loadUsers()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to deactivate user')
    }
  }

  const handleBulkOperation = async (operation: string, data?: any) => {
    if (selectedUsers.size === 0) {
      toast.error('Please select users first')
      return
    }

    try {
      await adminAPI.bulkUserOperations(operation as any, Array.from(selectedUsers), data)
      toast.success(`Bulk ${operation} completed successfully!`)
      setSelectedUsers(new Set())
      loadUsers()
    } catch (error: any) {
      toast.error(error.response?.data?.error || `Failed to perform bulk ${operation}`)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'STUDENT': return <GraduationCap className="w-4 h-4" />
      case 'TEACHER': return <BookOpen className="w-4 h-4" />
      case 'HEAD_TEACHER': return <Shield className="w-4 h-4" />
      default: return <Users className="w-4 h-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'STUDENT': return 'from-blue-500 to-cyan-400'
      case 'TEACHER': return 'from-green-500 to-emerald-400'
      case 'HEAD_TEACHER': return 'from-purple-500 to-pink-400'
      default: return 'from-gray-500 to-gray-400'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center">
            <Users className="w-8 h-8 mr-3 text-purple-400" />
            User Management
          </h1>
          <p className="text-slate-400 mt-2">Manage students, teachers, and administrative users</p>
        </div>
        
        <motion.button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary px-6 py-3 rounded-full flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          <span>Add User</span>
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              className="input pl-10"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            />
          </div>
          
          <select
            className="input"
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
          >
            <option value="">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="TEACHER">Teachers</option>
            <option value="HEAD_TEACHER">Head Teachers</option>
          </select>
          
          <select
            className="input"
            value={filters.batchType}
            onChange={(e) => setFilters({ ...filters, batchType: e.target.value, page: 1 })}
          >
            <option value="">All Batches</option>
            <option value="IN_CLASS_7">Class 7</option>
            <option value="IN_CLASS_8">Class 8</option>
            <option value="IN_CLASS_9">Class 9</option>
            <option value="IN_CLASS_10">Class 10</option>
            <option value="NEET_11">NEET 11</option>
            <option value="NEET_12">NEET 12</option>
            <option value="PCM_11">PCM 11</option>
            <option value="PCM_12">PCM 12</option>
          </select>
          
          <select
            className="input"
            value={filters.isActive}
            onChange={(e) => setFilters({ ...filters, isActive: e.target.value, page: 1 })}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.size > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl"
          >
            <span className="text-purple-400 font-medium">{selectedUsers.size} users selected</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkOperation('activate')}
                className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkOperation('deactivate')}
                className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
              >
                Deactivate
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card overflow-hidden"
      >
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4">
                      <input
                        type="checkbox"
                        className="rounded border-white/20 bg-transparent"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(new Set(users.map(u => u.id)))
                          } else {
                            setSelectedUsers(new Set())
                          }
                        }}
                      />
                    </th>
                    <th className="text-left p-4 text-slate-300 font-semibold">User</th>
                    <th className="text-left p-4 text-slate-300 font-semibold">Role</th>
                    <th className="text-left p-4 text-slate-300 font-semibold">Batch</th>
                    <th className="text-left p-4 text-slate-300 font-semibold">Status</th>
                    <th className="text-left p-4 text-slate-300 font-semibold">Last Login</th>
                    <th className="text-left p-4 text-slate-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          className="rounded border-white/20 bg-transparent"
                          checked={selectedUsers.has(user.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedUsers)
                            if (e.target.checked) {
                              newSelected.add(user.id)
                            } else {
                              newSelected.delete(user.id)
                            }
                            setSelectedUsers(newSelected)
                          }}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${getRoleColor(user.role)} rounded-xl flex items-center justify-center`}>
                            {getRoleIcon(user.role)}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{user.fullName}</div>
                            <div className="text-sm text-slate-400">{user.uid}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getRoleColor(user.role)} text-white`}>
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">
                        {user.batchType?.replace('_', ' ') || '—'}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {user.isActive ? (
                            <><UserCheck className="w-3 h-3 mr-1" /> Active</>
                          ) : (
                            <><UserX className="w-3 h-3 mr-1" /> Inactive</>
                          )}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">
                        {user.lastLoginAt 
                          ? new Date(user.lastLoginAt).toLocaleDateString()
                          : 'Never'
                        }
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedUser(user)
                              setShowDetailsModal(true)
                            }}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedUser(user)
                              setShowEditModal(true)
                            }}
                            className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              if (confirm(`Are you sure you want to deactivate ${user.fullName}?`)) {
                                handleDeleteUser(user.id)
                              }
                            }}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-white/10">
                <div className="text-slate-400 text-sm">
                  Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{' '}
                  {pagination.totalCount} users
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 bg-white/10 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded">
                    {pagination.currentPage} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-1 bg-white/10 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Create User Modal */}
      <CreateUserModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateUser}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={showEditModal}
        user={selectedUser}
        onClose={() => {
          setShowEditModal(false)
          setSelectedUser(null)
        }}
        onSubmit={handleUpdateUser}
      />

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={showDetailsModal}
        user={selectedUser}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedUser(null)
        }}
      />
    </div>
  )
}

// Create User Modal Component
const CreateUserModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  onSubmit: (userData: any) => void
}> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    uid: '',
    fullName: '',
    role: 'STUDENT',
    batchType: '',
    subjects: [],
    roomNumber: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    password: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Create New User</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">User ID *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.uid}
                  onChange={(e) => setFormData({ ...formData, uid: e.target.value.toUpperCase() })}
                  required
                  placeholder="e.g., STU001"
                />
              </div>
              
              <div>
                <label className="label">Full Name *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="label">Role *</label>
                <select
                  className="input"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="HEAD_TEACHER">Head Teacher</option>
                </select>
              </div>
              
              <div>
                <label className="label">Batch Type</label>
                <select
                  className="input"
                  value={formData.batchType}
                  onChange={(e) => setFormData({ ...formData, batchType: e.target.value })}
                >
                  <option value="">Select Batch</option>
                  <option value="IN_CLASS_7">Class 7</option>
                  <option value="IN_CLASS_8">Class 8</option>
                  <option value="IN_CLASS_9">Class 9</option>
                  <option value="IN_CLASS_10">Class 10</option>
                  <option value="NEET_11">NEET 11</option>
                  <option value="NEET_12">NEET 12</option>
                  <option value="PCM_11">PCM 11</option>
                  <option value="PCM_12">PCM 12</option>
                </select>
              </div>
              
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  className="input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              
              <div>
                <label className="label">Date of Birth</label>
                <input
                  type="date"
                  className="input"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <label className="label">Address</label>
              <textarea
                className="input resize-none h-20"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Complete address..."
              />
            </div>
            
            <div>
              <label className="label">Password *</label>
              <input
                type="password"
                className="input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="Minimum 6 characters"
              />
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary px-6 py-2 rounded-lg flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Create User</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Edit User Modal Component (similar to CreateUserModal but for editing)
const EditUserModal: React.FC<{
  isOpen: boolean
  user: User | null
  onClose: () => void
  onSubmit: (userId: string, userData: any) => void
}> = ({ isOpen, user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    role: 'STUDENT',
    batchType: '',
    subjects: [],
    roomNumber: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    isActive: true
  })

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        role: user.role,
        batchType: user.batchType || '',
        subjects: user.subjects ? JSON.parse(user.subjects) : [],
        roomNumber: user.roomNumber || '',
        phone: user.phone || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        isActive: user.isActive
      })
    }
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      onSubmit(user.id, formData)
    }
  }

  if (!isOpen || !user) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Edit User</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Full Name *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="label">Role *</label>
                <select
                  className="input"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="HEAD_TEACHER">Head Teacher</option>
                </select>
              </div>
              
              <div>
                <label className="label">Batch Type</label>
                <select
                  className="input"
                  value={formData.batchType}
                  onChange={(e) => setFormData({ ...formData, batchType: e.target.value })}
                >
                  <option value="">Select Batch</option>
                  <option value="IN_CLASS_7">Class 7</option>
                  <option value="IN_CLASS_8">Class 8</option>
                  <option value="IN_CLASS_9">Class 9</option>
                  <option value="IN_CLASS_10">Class 10</option>
                  <option value="NEET_11">NEET 11</option>
                  <option value="NEET_12">NEET 12</option>
                  <option value="PCM_11">PCM 11</option>
                  <option value="PCM_12">PCM 12</option>
                </select>
              </div>
              
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  className="input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              
              <div>
                <label className="label">Date of Birth</label>
                <input
                  type="date"
                  className="input"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>
              
              <div>
                <label className="label">Status</label>
                <select
                  className="input"
                  value={formData.isActive.toString()}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="label">Address</label>
              <textarea
                className="input resize-none h-20"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Complete address..."
              />
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary px-6 py-2 rounded-lg flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Update User</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// User Details Modal Component  
const UserDetailsModal: React.FC<{
  isOpen: boolean
  user: User | null
  onClose: () => void
}> = ({ isOpen, user, onClose }) => {
  if (!isOpen || !user) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">User Details</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${getRoleColor(user.role)} rounded-2xl flex items-center justify-center`}>
                {getRoleIcon(user.role)}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{user.fullName}</h3>
                <p className="text-slate-400">{user.uid}</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getRoleColor(user.role)} text-white mt-2`}>
                  {user.role.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 text-sm">Batch Type</label>
                  <p className="text-white">{user.batchType?.replace('_', ' ') || '—'}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Phone</label>
                  <p className="text-white flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {user.phone || '—'}
                  </p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Date of Birth</label>
                  <p className="text-white flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '—'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 text-sm">Status</label>
                  <p className={`text-white flex items-center ${user.isActive ? 'text-green-400' : 'text-red-400'}`}>
                    {user.isActive ? <UserCheck className="w-4 h-4 mr-2" /> : <UserX className="w-4 h-4 mr-2" />}
                    {user.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Last Login</label>
                  <p className="text-white">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}
                  </p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Created</label>
                  <p className="text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {user.address && (
              <div>
                <label className="text-slate-400 text-sm">Address</label>
                <p className="text-white flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                  {user.address}
                </p>
              </div>
            )}

            {/* Activity Stats */}
            {user._count && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-6 border-t border-white/10">
                {user.role === 'TEACHER' && (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{user._count.testsCreated}</div>
                      <div className="text-xs text-slate-400">Tests Created</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{user._count.homeworkAssigned}</div>
                      <div className="text-xs text-slate-400">Homework Assigned</div>
                    </div>
                  </>
                )}
                {user.role === 'STUDENT' && (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{user._count.submissions}</div>
                      <div className="text-xs text-slate-400">Tests Attempted</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">{user._count.doubts}</div>
                      <div className="text-xs text-slate-400">Doubts Asked</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-400">{user._count.homeworkSubmissions}</div>
                      <div className="text-xs text-slate-400">Homework Submitted</div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Helper functions
const getRoleIcon = (role: string) => {
  switch (role) {
    case 'STUDENT': return <GraduationCap className="w-4 h-4 text-white" />
    case 'TEACHER': return <BookOpen className="w-4 h-4 text-white" />
    case 'HEAD_TEACHER': return <Shield className="w-4 h-4 text-white" />
    default: return <Users className="w-4 h-4 text-white" />
  }
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'STUDENT': return 'from-blue-500 to-cyan-400'
    case 'TEACHER': return 'from-green-500 to-emerald-400'
    case 'HEAD_TEACHER': return 'from-purple-500 to-pink-400'
    default: return 'from-gray-500 to-gray-400'
  }
}

export default UserManagement