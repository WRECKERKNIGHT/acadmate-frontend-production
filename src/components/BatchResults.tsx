import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface Batch {
  id: string;
  type: string;
  name: string;
}

interface BatchStat {
  batch: Batch;
  totalTests: number;
  totalSubmissions: number;
  averageScore: number;
  passRate: number;
  studentsCount: number;
}

interface StudentPerformance {
  student: {
    uid: string;
    fullName: string;
    batchType: string;
  };
  testsAttempted: number;
  passedTests: number;
  averageScore: number;
  bestScore: number;
}

interface TestResult {
  id: string;
  title: string;
  author: {
    uid: string;
    fullName: string;
  };
  totalMarks: number;
  status: string;
  createdAt: string;
  submissionsCount: number;
  averageScore: number;
  topScore: number;
}

interface SubjectAnalysis {
  subject: string;
  testsCount: number;
  studentsCount: number;
  averageScore: number;
  topScore: number;
  totalSubmissions: number;
}

const BatchResults: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'detailed' | 'student' | 'subjects' | 'comparative'>('overview');
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');

  // Data states
  const [batchOverview, setBatchOverview] = useState<any>(null);
  const [detailedResults, setDetailedResults] = useState<any>(null);
  const [studentPerformance, setStudentPerformance] = useState<any>(null);
  const [subjectAnalysis, setSubjectAnalysis] = useState<any>(null);
  const [comparativeAnalysis, setComparativeAnalysis] = useState<any>(null);

  useEffect(() => {
    if (activeView === 'overview') {
      fetchBatchOverview();
    } else if (activeView === 'comparative' && user?.role === 'HEAD_TEACHER') {
      fetchComparativeAnalysis();
    }
  }, [activeView, user?.role]);

  useEffect(() => {
    if (selectedBatch && activeView === 'detailed') {
      fetchDetailedResults(selectedBatch);
    } else if (selectedBatch && activeView === 'subjects') {
      fetchSubjectAnalysis(selectedBatch);
    }
  }, [selectedBatch, activeView]);

  useEffect(() => {
    if (selectedStudent && activeView === 'student') {
      fetchStudentPerformance(selectedStudent);
    }
  }, [selectedStudent, activeView]);

  const fetchBatchOverview = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/results/batch-overview');
      setBatchOverview(response.data);
    } catch (error: any) {
      console.error('Error fetching batch overview:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch batch overview');
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedResults = async (batchId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/results/batch/${batchId}/detailed`);
      setDetailedResults(response.data);
    } catch (error: any) {
      console.error('Error fetching detailed results:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch detailed results');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentPerformance = async (studentUid: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/results/student/${studentUid}/performance`);
      setStudentPerformance(response.data);
    } catch (error: any) {
      console.error('Error fetching student performance:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch student performance');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjectAnalysis = async (batchId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/results/batch/${batchId}/subject-analysis`);
      setSubjectAnalysis(response.data);
    } catch (error: any) {
      console.error('Error fetching subject analysis:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch subject analysis');
    } finally {
      setLoading(false);
    }
  };

  const fetchComparativeAnalysis = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/results/comparative-analysis');
      setComparativeAnalysis(response.data);
    } catch (error: any) {
      console.error('Error fetching comparative analysis:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch comparative analysis');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#3b82f6'; // Blue
    if (score >= 40) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const getPerformanceIcon = (score: number): string => {
    if (score >= 80) return '🏆';
    if (score >= 60) return '⭐';
    if (score >= 40) return '👍';
    return '📈';
  };

  const renderOverview = () => {
    if (!batchOverview) return <div className="loading">Loading overview...</div>;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Batch Results Overview</h2>
          <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{batchOverview.teacher.fullName}</h3>
                <p className="text-gray-600">Subjects: {batchOverview.teacher.subjects?.join(', ') || 'All'}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{batchOverview.totalTests}</div>
                <div className="text-sm text-gray-600">Total Tests Created</div>
              </div>
            </div>
          </div>
        </div>

        {/* Batch Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batchOverview.batchStats.map((batch: BatchStat, index: number) => (
            <div 
              key={batch.batch.id} 
              className="stagger-item card-animated hover-lift bg-white p-6 rounded-xl shadow-sm border cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => {
                setSelectedBatch(batch.batch.id);
                setActiveView('detailed');
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{batch.batch.name}</h3>
                  <p className="text-gray-600 text-sm">{batch.studentsCount} students</p>
                </div>
                <div className="text-2xl">
                  {getPerformanceIcon(batch.averageScore)}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Score</span>
                  <span 
                    className="font-bold text-lg"
                    style={{ color: getScoreColor(batch.averageScore) }}
                  >
                    {batch.averageScore.toFixed(1)}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pass Rate</span>
                  <span 
                    className="font-semibold"
                    style={{ color: getScoreColor(batch.passRate) }}
                  >
                    {batch.passRate.toFixed(1)}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tests Conducted</span>
                  <span className="font-semibold text-gray-900">{batch.totalTests}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Submissions</span>
                  <span className="font-semibold text-gray-900">{batch.totalSubmissions}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Performance</span>
                  <span>{batch.averageScore.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(batch.averageScore, 100)}%`,
                      background: `linear-gradient(90deg, ${getScoreColor(batch.averageScore)}, ${getScoreColor(batch.averageScore)}88)`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDetailedResults = () => {
    if (!detailedResults) return <div className="loading">Loading detailed results...</div>;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => setActiveView('overview')}
              className="text-blue-600 hover:text-blue-800 text-sm mb-2"
            >
              ← Back to Overview
            </button>
            <h2 className="text-2xl font-bold text-gray-900">
              {detailedResults.batch.name} - Detailed Results
            </h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveView('subjects')}
              className="btn btn-secondary btn-sm"
            >
              Subject Analysis
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-blue-600">{detailedResults.summary.totalStudents}</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-green-600">{detailedResults.summary.totalTests}</div>
            <div className="text-sm text-gray-600">Tests Conducted</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div 
              className="text-2xl font-bold"
              style={{ color: getScoreColor(detailedResults.summary.averageBatchScore) }}
            >
              {detailedResults.summary.averageBatchScore}%
            </div>
            <div className="text-sm text-gray-600">Batch Average</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div 
              className="text-2xl font-bold"
              style={{ color: getScoreColor(detailedResults.summary.studentsPassingRate) }}
            >
              {detailedResults.summary.studentsPassingRate}%
            </div>
            <div className="text-sm text-gray-600">Pass Rate</div>
          </div>
        </div>

        {/* Student Performance Ranking */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Performance Ranking</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Rank</th>
                  <th className="text-left py-3 px-4">Student</th>
                  <th className="text-center py-3 px-4">Tests Attempted</th>
                  <th className="text-center py-3 px-4">Average Score</th>
                  <th className="text-center py-3 px-4">Best Score</th>
                  <th className="text-center py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {detailedResults.studentPerformance.slice(0, 20).map((student: StudentPerformance, index: number) => (
                  <tr key={student.student.uid} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">#{index + 1}</span>
                        {index < 3 && (
                          <span className="text-lg">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{student.student.fullName}</div>
                        <div className="text-sm text-gray-600">{student.student.uid}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">{student.testsAttempted}</td>
                    <td className="py-3 px-4 text-center">
                      <span 
                        className="font-semibold"
                        style={{ color: getScoreColor(student.averageScore) }}
                      >
                        {student.averageScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span 
                        className="font-semibold"
                        style={{ color: getScoreColor(student.bestScore) }}
                      >
                        {student.bestScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedStudent(student.student.uid);
                          setActiveView('student');
                        }}
                        className="btn btn-sm btn-secondary"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Tests */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tests</h3>
          <div className="space-y-4">
            {detailedResults.tests.slice(0, 10).map((test: TestResult) => (
              <div key={test.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{test.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Created by: {test.author.fullName} | Total Marks: {test.totalMarks}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">{test.submissionsCount} submissions</span>
                      <span 
                        className="font-semibold"
                        style={{ color: getScoreColor(test.averageScore) }}
                      >
                        Avg: {test.averageScore}%
                      </span>
                      <span 
                        className="font-semibold"
                        style={{ color: getScoreColor(test.topScore) }}
                      >
                        Top: {test.topScore}%
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(test.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderStudentPerformance = () => {
    if (!studentPerformance) return <div className="loading">Loading student performance...</div>;

    return (
      <div className="space-y-6">
        <div>
          <button
            onClick={() => setActiveView('detailed')}
            className="text-blue-600 hover:text-blue-800 text-sm mb-2"
          >
            ← Back to Batch Results
          </button>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {studentPerformance.student.fullName}
                </h2>
                <p className="text-gray-600">
                  {studentPerformance.student.uid} | {studentPerformance.student.batchType}
                </p>
              </div>
              <div className="text-right">
                <div 
                  className="text-3xl font-bold"
                  style={{ color: getScoreColor(studentPerformance.summary.averageScore) }}
                >
                  {studentPerformance.summary.averageScore}%
                </div>
                <div className="text-sm text-gray-600">Overall Average</div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-blue-600">{studentPerformance.summary.testsAttempted}</div>
            <div className="text-sm text-gray-600">Tests Attempted</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-green-600">{studentPerformance.summary.passedTests}</div>
            <div className="text-sm text-gray-600">Tests Passed</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div 
              className="text-2xl font-bold"
              style={{ color: getScoreColor(studentPerformance.summary.bestScore) }}
            >
              {studentPerformance.summary.bestScore}%
            </div>
            <div className="text-sm text-gray-600">Best Score</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-purple-600">{studentPerformance.summary.totalMarksObtained}</div>
            <div className="text-sm text-gray-600">Total Marks</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round((studentPerformance.summary.totalMarksObtained / studentPerformance.summary.totalPossibleMarks) * 100) || 0}%
            </div>
            <div className="text-sm text-gray-600">Overall %</div>
          </div>
        </div>

        {/* Performance Trend Chart Placeholder */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h3>
          <div className="space-y-2">
            {studentPerformance.performanceTrend.map((trend: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex-1">
                  <span className="text-sm text-gray-600">Test #{trend.testNumber}: </span>
                  <span className="text-sm font-medium">{trend.testTitle}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span 
                    className="font-semibold"
                    style={{ color: getScoreColor(trend.percentage) }}
                  >
                    {trend.percentage}%
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(trend.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tests */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Test Results</h3>
          <div className="space-y-3">
            {studentPerformance.recentTests.map((test: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{test.test.title}</h4>
                    <p className="text-sm text-gray-600">
                      Score: {test.score}/{test.totalMarks} ({test.percentage}%)
                    </p>
                    <p className="text-xs text-gray-500">
                      Time taken: {test.timeTaken} minutes
                    </p>
                  </div>
                  <div className="text-right">
                    <div 
                      className="text-lg font-bold"
                      style={{ color: getScoreColor(test.percentage) }}
                    >
                      {test.percentage}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {test.submittedAt ? new Date(test.submittedAt).toLocaleDateString() : 'In Progress'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSubjectAnalysis = () => {
    if (!subjectAnalysis) return <div className="loading">Loading subject analysis...</div>;

    return (
      <div className="space-y-6">
        <div>
          <button
            onClick={() => setActiveView('detailed')}
            className="text-blue-600 hover:text-blue-800 text-sm mb-2"
          >
            ← Back to Batch Results
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            Subject-wise Analysis - {subjectAnalysis.batch.name}
          </h2>
        </div>

        {/* Subject Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectAnalysis.subjectAnalysis.map((subject: SubjectAnalysis, index: number) => (
            <div 
              key={subject.subject} 
              className="stagger-item card-animated hover-lift bg-white p-6 rounded-xl shadow-sm border"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{subject.subject}</h3>
                <div className="text-2xl">
                  {getPerformanceIcon(subject.averageScore)}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Score</span>
                  <span 
                    className="font-bold text-lg"
                    style={{ color: getScoreColor(subject.averageScore) }}
                  >
                    {subject.averageScore}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Top Score</span>
                  <span 
                    className="font-semibold"
                    style={{ color: getScoreColor(subject.topScore) }}
                  >
                    {subject.topScore}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tests Conducted</span>
                  <span className="font-semibold text-gray-900">{subject.testsCount}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Students Participated</span>
                  <span className="font-semibold text-gray-900">{subject.studentsCount}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Submissions</span>
                  <span className="font-semibold text-gray-900">{subject.totalSubmissions}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Performance</span>
                  <span>{subject.averageScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(subject.averageScore, 100)}%`,
                      background: `linear-gradient(90deg, ${getScoreColor(subject.averageScore)}, ${getScoreColor(subject.averageScore)}88)`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        {subjectAnalysis.summary && (
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{subjectAnalysis.summary.totalSubjects}</div>
                <div className="text-sm text-gray-600">Subjects Analyzed</div>
              </div>
              <div className="text-center">
                <div 
                  className="text-2xl font-bold"
                  style={{ color: getScoreColor(subjectAnalysis.summary.overallAverageScore) }}
                >
                  {subjectAnalysis.summary.overallAverageScore}%
                </div>
                <div className="text-sm text-gray-600">Overall Average</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {subjectAnalysis.summary.bestPerformingSubject?.subject || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Best Performing Subject</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderComparativeAnalysis = () => {
    if (user?.role !== 'HEAD_TEACHER') {
      return (
        <div className="text-center py-8">
          <p className="text-red-500">Access denied. Only Head Teachers can view comparative analysis.</p>
        </div>
      );
    }

    if (!comparativeAnalysis) return <div className="loading">Loading comparative analysis...</div>;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Comparative Batch Analysis</h2>
          <p className="text-gray-600">Compare performance across all batches</p>
        </div>

        {/* Overall Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{comparativeAnalysis.overallSummary.totalBatches}</div>
              <div className="text-sm text-gray-600">Total Batches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{comparativeAnalysis.overallSummary.totalStudents}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{comparativeAnalysis.overallSummary.totalTests}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </div>
            <div className="text-center">
              <div 
                className="text-2xl font-bold"
                style={{ color: getScoreColor(comparativeAnalysis.overallSummary.overallAverageScore) }}
              >
                {comparativeAnalysis.overallSummary.overallAverageScore}%
              </div>
              <div className="text-sm text-gray-600">Overall Average</div>
            </div>
          </div>
        </div>

        {/* Batch Comparison */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Batch Performance Ranking</h3>
          <div className="space-y-4">
            {comparativeAnalysis.batchComparison.map((batch: any, index: number) => (
              <div key={batch.batch.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className="font-bold text-lg mr-2">#{index + 1}</span>
                      {index < 3 && (
                        <span className="text-xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{batch.batch.name}</h4>
                      <p className="text-sm text-gray-600">{batch.studentsCount} students | {batch.teachers.length} teachers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div 
                        className="text-lg font-bold"
                        style={{ color: getScoreColor(batch.averageScore) }}
                      >
                        {batch.averageScore}%
                      </div>
                      <div className="text-xs text-gray-600">Average</div>
                    </div>
                    
                    <div className="text-center">
                      <div 
                        className="text-lg font-bold"
                        style={{ color: getScoreColor(batch.passRate) }}
                      >
                        {batch.passRate}%
                      </div>
                      <div className="text-xs text-gray-600">Pass Rate</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{batch.testsCount}</div>
                      <div className="text-xs text-gray-600">Tests</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{batch.totalSubmissions}</div>
                      <div className="text-xs text-gray-600">Submissions</div>
                    </div>
                  </div>
                </div>
                
                {batch.topStudent && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      🏆 Top Performer: <span className="font-semibold">{batch.topStudent.fullName}</span>
                      {batch.topStudent.submissions.length > 0 && (
                        <span className="ml-2">
                          ({Math.round(batch.topStudent.submissions.reduce((sum: number, sub: any) => sum + sub.percentage, 0) / batch.topStudent.submissions.length)}% avg)
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading && !batchOverview && !detailedResults && !studentPerformance && !subjectAnalysis && !comparativeAnalysis) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading">Loading batch results...</div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          {[
            { key: 'overview', label: 'Batch Overview', icon: '📊' },
            ...(user?.role === 'HEAD_TEACHER' ? [{ key: 'comparative', label: 'Comparative Analysis', icon: '📈' }] : [])
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveView(tab.key as any)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors hover-scale ${
                activeView === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeView === 'overview' && renderOverview()}
      {activeView === 'detailed' && renderDetailedResults()}
      {activeView === 'student' && renderStudentPerformance()}
      {activeView === 'subjects' && renderSubjectAnalysis()}
      {activeView === 'comparative' && renderComparativeAnalysis()}
    </div>
  );
};

export default BatchResults;