import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, Button, Input, Badge, Loading, Modal, icons } from './ui'
import api from '../config/api'

interface Teacher {
  id: string
  fullName: string
  email: string
  subjects: string[]
  batches: string[]
  roomNumber?: string
  phone?: string
  experience?: string
  qualification?: string
  profileImage?: string
  isActive: boolean
}

interface Student {
  id: string
  fullName: string
  email: string
  batchType: string
  rollNumber?: string
  phone?: string
  parentPhone?: string
  dateOfBirth?: string
  address?: string
  profileImage?: string
  isActive: boolean
}

interface Batch {
  id: string
  name: string
  type: string
  students: Student[]
  teachers: Teacher[]
  subjects: string[]
}

const PeopleDirectory: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'teachers' | 'students' | 'batches'>('teachers')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPerson, setSelectedPerson] = useState<Teacher | Student | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    subject: '',
    batch: '',
    status: 'all'
  })

  useEffect(() => {
    loadPeopleData()
  }, [])

  const loadPeopleData = async () => {
    try {
      setLoading(true)
      const [teachersRes, studentsRes, batchesRes] = await Promise.all([
        api.profile.getAllTeachers(),
        api.profile.getAllStudents(),
        api.classes.getAll()
      ])
      
      setTeachers(teachersRes.data || [])
      setStudents(studentsRes.data || [])
      setBatches(batchesRes.data || [])
    } catch (error) {
      console.error('Error loading people data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !filters.subject || teacher.subjects.includes(filters.subject)
    const matchesBatch = !filters.batch || teacher.batches.includes(filters.batch)
    const matchesStatus = filters.status === 'all' || 
                         (filters.status === 'active' && teacher.isActive) ||
                         (filters.status === 'inactive' && !teacher.isActive)
    
    return matchesSearch && matchesSubject && matchesBatch && matchesStatus
  })

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBatch = !filters.batch || student.batchType === filters.batch
    const matchesStatus = filters.status === 'all' || 
                         (filters.status === 'active' && student.isActive) ||
                         (filters.status === 'inactive' && !student.isActive)
    
    return matchesSearch && matchesBatch && matchesStatus
  })

  const TeacherCard: React.FC<{ teacher: Teacher }> = ({ teacher }) => {
    const UserIcon = icons.user
    const MailIcon = icons.mail
    const BookIcon = icons.book
    const GraduationIcon = icons.graduation
    
    return (
      <Card className="p-6" hover onClick={() => {
        setSelectedPerson(teacher)
        setModalOpen(true)
      }}>
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            {teacher.profileImage ? (
              <img src={teacher.profileImage} alt={teacher.fullName} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <UserIcon className="w-8 h-8 text-white" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-100 truncate">{teacher.fullName}</h3>
              <Badge variant={teacher.isActive ? 'success' : 'error'}>
                {teacher.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-1 mt-1">
              <MailIcon className="w-4 h-4 text-slate-400" />
              <p className="text-sm text-slate-300 truncate">{teacher.email}</p>
            </div>
            
            <div className="flex items-center space-x-1 mt-2">
              <BookIcon className="w-4 h-4 text-slate-400" />
              <div className="flex flex-wrap gap-1">
                {teacher.subjects.slice(0, 3).map(subject => (
                  <Badge key={subject} variant="primary" size="sm">{subject}</Badge>
                ))}
                {teacher.subjects.length > 3 && (
                  <Badge variant="info" size="sm">+{teacher.subjects.length - 3}</Badge>
                )}
              </div>
            </div>
            
            {teacher.batches.length > 0 && (
              <div className="flex items-center space-x-1 mt-2">
                <GraduationIcon className="w-4 h-4 text-slate-400" />
                <div className="flex flex-wrap gap-1">
                  {teacher.batches.slice(0, 2).map(batch => (
                    <Badge key={batch} variant="warning" size="sm">{batch}</Badge>
                  ))}
                  {teacher.batches.length > 2 && (
                    <Badge variant="info" size="sm">+{teacher.batches.length - 2}</Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    )
  }

  const StudentCard: React.FC<{ student: Student }> = ({ student }) => {
    const UserIcon = icons.user
    const MailIcon = icons.mail
    const GraduationIcon = icons.graduation
    
    return (
      <Card className="p-6" hover onClick={() => {
        setSelectedPerson(student)
        setModalOpen(true)
      }}>
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
            {student.profileImage ? (
              <img src={student.profileImage} alt={student.fullName} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <UserIcon className="w-8 h-8 text-white" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-100 truncate">{student.fullName}</h3>
              <Badge variant={student.isActive ? 'success' : 'error'}>
                {student.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-1 mt-1">
              <MailIcon className="w-4 h-4 text-slate-400" />
              <p className="text-sm text-slate-300 truncate">{student.email}</p>
            </div>
            
            <div className="flex items-center space-x-1 mt-2">
              <GraduationIcon className="w-4 h-4 text-slate-400" />
              <Badge variant="warning" size="sm">{student.batchType}</Badge>
            </div>
            
            {student.rollNumber && (
              <p className="text-sm text-slate-400 mt-1">Roll No: {student.rollNumber}</p>
            )}
          </div>
        </div>
      </Card>
    )
  }

  const BatchCard: React.FC<{ batch: Batch }> = ({ batch }) => {
    const UsersIcon = icons.users
    const BookIcon = icons.book
    
    return (
      <Card className="p-6" gradient>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">{batch.name}</h3>
            <p className="text-slate-300 text-sm mt-1">{batch.type}</p>
            
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-1">
                <UsersIcon className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300">{batch.students.length} Students</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookIcon className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300">{batch.subjects.length} Subjects</span>
              </div>
            </div>
            
            <div className="mt-3">
              <p className="text-xs text-slate-400 mb-1">Subjects:</p>
              <div className="flex flex-wrap gap-1">
                {batch.subjects.map(subject => (
                  <Badge key={subject} variant="primary" size="sm">{subject}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  const PersonModal: React.FC = () => {
    if (!selectedPerson) return null
    
    const isTeacher = 'subjects' in selectedPerson
    const person = selectedPerson
    const UserIcon = icons.user
    const MailIcon = icons.mail
    const PhoneIcon = icons.phone
    const LocationIcon = icons.location
    
    return (
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`${isTeacher ? 'Teacher' : 'Student'} Details`}
        size="lg"
      >
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              {person.profileImage ? (
                <img src={person.profileImage} alt={person.fullName} className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <UserIcon className="w-10 h-10 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-100">{person.fullName}</h3>
              <Badge variant={person.isActive ? 'success' : 'error'} className="mt-1">
                {person.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate-200 mb-3">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MailIcon className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300">{person.email}</span>
                </div>
                {person.phone && (
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">{person.phone}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-200 mb-3">
                {isTeacher ? 'Teaching Details' : 'Academic Details'}
              </h4>
              {isTeacher ? (
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-slate-400">Subjects:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(person as Teacher).subjects.map(subject => (
                        <Badge key={subject} variant="primary">{subject}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Batches:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(person as Teacher).batches.map(batch => (
                        <Badge key={batch} variant="warning">{batch}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-slate-400">Batch:</p>
                    <Badge variant="warning">{(person as Student).batchType}</Badge>
                  </div>
                  {(person as Student).rollNumber && (
                    <div>
                      <p className="text-sm text-slate-400">Roll Number:</p>
                      <p className="text-slate-300">{(person as Student).rollNumber}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  if (loading) return <Loading className="h-64" />

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-100">People Directory</h1>
        <Button icon="refresh" onClick={loadPeopleData}>Refresh</Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1">
        {(['teachers', 'students', 'batches'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-all ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon="search"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filters.batch}
            onChange={(e) => setFilters(prev => ({ ...prev, batch: e.target.value }))}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200"
          >
            <option value="">All Batches</option>
            {batches.map(batch => (
              <option key={batch.id} value={batch.type}>{batch.type}</option>
            ))}
          </select>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'teachers' && (
          <>
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map(teacher => (
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
                  <icons.users className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-400">No teachers found</p>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'students' && (
          <>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <StudentCard key={student.id} student={student} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
                  <icons.graduation className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-400">No students found</p>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'batches' && (
          <>
            {batches.length > 0 ? (
              batches.map(batch => (
                <BatchCard key={batch.id} batch={batch} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
                  <icons.book className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-400">No batches found</p>
              </div>
            )}
          </>
        )}
      </div>

      <PersonModal />
    </div>
  )
}

export default PeopleDirectory