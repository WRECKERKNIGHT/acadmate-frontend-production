import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

interface SampleQuestion {
  id: string;
  subject: string;
  class: string;
  type: 'MCQ' | 'SHORT_ANSWER' | 'INTEGER';
  text: string;
  options: string[];
  correctAnswers: string[];
  explanation: string;
  difficulty: string;
  tags: string[];
}

interface Question {
  id: string;
  type: 'MCQ' | 'SHORT_ANSWER' | 'INTEGER';
  text: string;
  imageUrl?: string;
  imageFile?: File;
  options: string[];
  correctAnswers: string[];
  explanation: string;
  marks: number;
  negativeMarks: number;
  difficulty: string;
  tags: string[];
}

interface Section {
  id: string;
  title: string;
  description: string;
  timeLimit?: number;
  questions: Question[];
}

const TestCreatorEnhanced: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<'creator' | 'sample-bank' | 'preview'>('creator');

  // Test metadata
  const [testData, setTestData] = useState({
    title: '',
    description: '',
    duration: 180,
    totalMarks: 0,
    passingMarks: 0,
    instructions: '',
    allowReview: true,
    shuffleQuestions: false,
    showResults: true,
    scheduledAt: '',
    endsAt: ''
  });

  // Sections and questions
  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      title: 'Section A',
      description: 'Multiple Choice Questions',
      questions: []
    }
  ]);

  // Sample questions
  const [sampleQuestions, setSampleQuestions] = useState<SampleQuestion[]>([]);
  const [sampleFilters, setSampleFilters] = useState({
    subject: '',
    class: '',
    difficulty: '',
    tags: ''
  });
  const [selectedSamples, setSelectedSamples] = useState<Set<string>>(new Set());

  // UI state
  const [activeSectionId, setActiveSectionId] = useState('1');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  useEffect(() => {
    fetchSampleQuestions();
  }, []);

  useEffect(() => {
    // Calculate total marks when sections change
    const total = sections.reduce((sum, section) => 
      sum + section.questions.reduce((qSum, q) => qSum + q.marks, 0), 0
    );
    setTestData(prev => ({ ...prev, totalMarks: total }));
  }, [sections]);

  const fetchSampleQuestions = async () => {
    try {
      const response = await axios.get('/api/sample-questions', {
        params: sampleFilters
      });
      setSampleQuestions(response.data);
    } catch (error) {
      console.error('Error fetching sample questions:', error);
      toast.error('Failed to fetch sample questions');
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await axios.post('/api/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw new Error('Failed to upload image');
    }
  };

  const addSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: `Section ${String.fromCharCode(65 + sections.length)}`,
      description: 'New Section',
      questions: []
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, ...updates } : section
    ));
  };

  const deleteSection = (sectionId: string) => {
    if (sections.length <= 1) {
      toast.error('At least one section is required');
      return;
    }
    setSections(sections.filter(s => s.id !== sectionId));
    if (activeSectionId === sectionId) {
      setActiveSectionId(sections[0].id);
    }
  };

  const addQuestion = (sectionId: string, question: Question) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, questions: [...section.questions, question] }
        : section
    ));
  };

  const updateQuestion = (sectionId: string, questionId: string, updates: Partial<Question>) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section, 
            questions: section.questions.map(q => 
              q.id === questionId ? { ...q, ...updates } : q
            )
          }
        : section
    ));
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, questions: section.questions.filter(q => q.id !== questionId) }
        : section
    ));
  };

  const addSampleQuestionsToTest = () => {
    if (selectedSamples.size === 0) {
      toast.error('Please select questions to add');
      return;
    }

    const questionsToAdd = sampleQuestions
      .filter(sq => selectedSamples.has(sq.id))
      .map(sq => ({
        id: Date.now().toString() + Math.random(),
        type: sq.type,
        text: sq.text,
        options: sq.options,
        correctAnswers: sq.correctAnswers,
        explanation: sq.explanation,
        marks: sq.type === 'MCQ' ? 4 : sq.type === 'SHORT_ANSWER' ? 6 : 2,
        negativeMarks: sq.type === 'MCQ' ? 1 : 0,
        difficulty: sq.difficulty,
        tags: sq.tags
      } as Question));

    const activeSection = sections.find(s => s.id === activeSectionId);
    if (activeSection) {
      setSections(sections.map(section => 
        section.id === activeSectionId 
          ? { ...section, questions: [...section.questions, ...questionsToAdd] }
          : section
      ));
      
      setSelectedSamples(new Set());
      toast.success(`Added ${questionsToAdd.length} questions to ${activeSection.title}`);
      setActiveView('creator');
    }
  };

  const handleTestSubmit = async () => {
    if (!testData.title.trim()) {
      toast.error('Test title is required');
      return;
    }

    if (sections.every(s => s.questions.length === 0)) {
      toast.error('Add at least one question to the test');
      return;
    }

    setLoading(true);
    try {
      // Upload any images first
      const sectionsWithImages = await Promise.all(
        sections.map(async (section) => ({
          ...section,
          questions: await Promise.all(
            section.questions.map(async (question) => {
              if (question.imageFile) {
                const imageUrl = await handleImageUpload(question.imageFile);
                return { ...question, imageUrl, imageFile: undefined };
              }
              return question;
            })
          )
        }))
      );

      const testPayload = {
        ...testData,
        sections: sectionsWithImages
      };

      await axios.post('/api/tests', testPayload);
      toast.success('Test created successfully!');
      
      // Reset form
      setTestData({
        title: '',
        description: '',
        duration: 180,
        totalMarks: 0,
        passingMarks: 0,
        instructions: '',
        allowReview: true,
        shuffleQuestions: false,
        showResults: true,
        scheduledAt: '',
        endsAt: ''
      });
      setSections([{
        id: '1',
        title: 'Section A',
        description: 'Multiple Choice Questions',
        questions: []
      }]);
      
    } catch (error: any) {
      console.error('Error creating test:', error);
      toast.error(error.response?.data?.message || 'Failed to create test');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestionForm = () => {
    const [questionData, setQuestionData] = useState<Partial<Question>>(
      editingQuestion || {
        type: 'MCQ',
        text: '',
        options: ['', '', '', ''],
        correctAnswers: [''],
        explanation: '',
        marks: 4,
        negativeMarks: 1,
        difficulty: 'MEDIUM',
        tags: []
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!questionData.text?.trim()) {
        toast.error('Question text is required');
        return;
      }

      if (questionData.type === 'MCQ' && questionData.options?.some(opt => !opt.trim())) {
        toast.error('All options are required for MCQ');
        return;
      }

      if (!questionData.correctAnswers?.length || !questionData.correctAnswers[0]) {
        toast.error('Correct answer is required');
        return;
      }

      const newQuestion: Question = {
        id: editingQuestion?.id || Date.now().toString(),
        type: questionData.type!,
        text: questionData.text!,
        imageFile: questionData.imageFile,
        imageUrl: questionData.imageUrl,
        options: questionData.options || [],
        correctAnswers: questionData.correctAnswers!,
        explanation: questionData.explanation || '',
        marks: questionData.marks || 1,
        negativeMarks: questionData.negativeMarks || 0,
        difficulty: questionData.difficulty || 'MEDIUM',
        tags: questionData.tags || []
      };

      if (editingQuestion) {
        updateQuestion(activeSectionId, editingQuestion.id, newQuestion);
      } else {
        addQuestion(activeSectionId, newQuestion);
      }

      setShowQuestionForm(false);
      setEditingQuestion(null);
    };

    return (
      <div className="modal-overlay modal-backdrop">
        <div className="modal-content" style={{ maxWidth: '800px' }}>
          <div className="modal-header">
            <h3 className="modal-title">
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </h3>
            <button 
              onClick={() => {
                setShowQuestionForm(false);
                setEditingQuestion(null);
              }} 
              className="modal-close"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-body space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Question Type</label>
                <select
                  className="form-select focus-ring"
                  value={questionData.type}
                  onChange={(e) => setQuestionData({ ...questionData, type: e.target.value as any })}
                >
                  <option value="MCQ">Multiple Choice</option>
                  <option value="SHORT_ANSWER">Short Answer</option>
                  <option value="INTEGER">Integer Type</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Difficulty</label>
                <select
                  className="form-select focus-ring"
                  value={questionData.difficulty}
                  onChange={(e) => setQuestionData({ ...questionData, difficulty: e.target.value })}
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Marks</label>
                <input
                  type="number"
                  className="form-input focus-ring"
                  value={questionData.marks}
                  onChange={(e) => setQuestionData({ ...questionData, marks: parseInt(e.target.value) })}
                  min="1"
                  max="20"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Negative Marks</label>
                <input
                  type="number"
                  className="form-input focus-ring"
                  value={questionData.negativeMarks}
                  onChange={(e) => setQuestionData({ ...questionData, negativeMarks: parseInt(e.target.value) })}
                  min="0"
                  max="10"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Question Text *</label>
              <textarea
                className="form-textarea focus-ring"
                value={questionData.text}
                onChange={(e) => setQuestionData({ ...questionData, text: e.target.value })}
                placeholder="Enter your question here..."
                rows={3}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Question Image (Optional)</label>
              <input
                type="file"
                className="form-input focus-ring"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setQuestionData({ ...questionData, imageFile: file });
                  }
                }}
              />
              {questionData.imageFile && (
                <div className="mt-2">
                  <img 
                    src={URL.createObjectURL(questionData.imageFile)} 
                    alt="Preview" 
                    className="max-w-xs rounded border"
                  />
                </div>
              )}
            </div>

            {questionData.type === 'MCQ' && (
              <div className="form-group">
                <label className="form-label">Options *</label>
                <div className="space-y-2">
                  {(questionData.options || ['', '', '', '']).map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <input
                        type="text"
                        className="form-input focus-ring flex-1"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(questionData.options || [])];
                          newOptions[index] = e.target.value;
                          setQuestionData({ ...questionData, options: newOptions });
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      />
                      <input
                        type="checkbox"
                        checked={questionData.correctAnswers?.includes(option)}
                        onChange={(e) => {
                          const correct = questionData.correctAnswers || [];
                          if (e.target.checked) {
                            setQuestionData({ 
                              ...questionData, 
                              correctAnswers: [...correct, option] 
                            });
                          } else {
                            setQuestionData({ 
                              ...questionData, 
                              correctAnswers: correct.filter(ans => ans !== option) 
                            });
                          }
                        }}
                        title="Mark as correct answer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {questionData.type !== 'MCQ' && (
              <div className="form-group">
                <label className="form-label">Correct Answer *</label>
                <input
                  type="text"
                  className="form-input focus-ring"
                  value={questionData.correctAnswers?.[0] || ''}
                  onChange={(e) => setQuestionData({ 
                    ...questionData, 
                    correctAnswers: [e.target.value] 
                  })}
                  placeholder="Enter the correct answer"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Explanation (Optional)</label>
              <textarea
                className="form-textarea focus-ring"
                value={questionData.explanation}
                onChange={(e) => setQuestionData({ ...questionData, explanation: e.target.value })}
                placeholder="Explain the correct answer..."
                rows={2}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tags (comma-separated)</label>
              <input
                type="text"
                className="form-input focus-ring"
                value={questionData.tags?.join(', ') || ''}
                onChange={(e) => setQuestionData({ 
                  ...questionData, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                })}
                placeholder="algebra, geometry, calculus"
              />
            </div>
          </form>

          <div className="modal-footer">
            <button 
              type="button" 
              onClick={() => {
                setShowQuestionForm(false);
                setEditingQuestion(null);
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="btn btn-primary btn-animated"
            >
              {editingQuestion ? 'Update Question' : 'Add Question'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSampleQuestionsBank = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sample Questions Bank</h2>
          <p className="text-gray-600">Browse and add pre-made questions to your test</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('creator')}
            className="btn btn-secondary"
          >
            Back to Creator
          </button>
          {selectedSamples.size > 0 && (
            <button
              onClick={addSampleQuestionsToTest}
              className="btn btn-primary"
            >
              Add Selected ({selectedSamples.size})
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Subject</label>
            <select
              className="form-select focus-ring"
              value={sampleFilters.subject}
              onChange={(e) => setSampleFilters({ ...sampleFilters, subject: e.target.value })}
            >
              <option value="">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="English">English</option>
            </select>
          </div>

          <div>
            <label className="form-label">Class</label>
            <select
              className="form-select focus-ring"
              value={sampleFilters.class}
              onChange={(e) => setSampleFilters({ ...sampleFilters, class: e.target.value })}
            >
              <option value="">All Classes</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>
          </div>

          <div>
            <label className="form-label">Difficulty</label>
            <select
              className="form-select focus-ring"
              value={sampleFilters.difficulty}
              onChange={(e) => setSampleFilters({ ...sampleFilters, difficulty: e.target.value })}
            >
              <option value="">All Levels</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchSampleQuestions}
              className="btn btn-primary w-full"
            >
              Search Questions
            </button>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {sampleQuestions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-6xl mb-4">📝</div>
            <p>No sample questions found. Try adjusting your filters.</p>
          </div>
        ) : (
          sampleQuestions.map((question) => (
            <div
              key={question.id}
              className={`card p-4 cursor-pointer transition-all ${
                selectedSamples.has(question.id) 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => {
                const newSelected = new Set(selectedSamples);
                if (newSelected.has(question.id)) {
                  newSelected.delete(question.id);
                } else {
                  newSelected.add(question.id);
                }
                setSelectedSamples(newSelected);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="badge badge-info">{question.subject}</span>
                    <span className="badge badge-secondary">Class {question.class}</span>
                    <span className={`badge ${
                      question.difficulty === 'EASY' ? 'badge-success' :
                      question.difficulty === 'MEDIUM' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {question.difficulty}
                    </span>
                    <span className="badge badge-secondary">{question.type}</span>
                  </div>
                  
                  <p className="text-gray-900 mb-2">{question.text}</p>
                  
                  {question.type === 'MCQ' && (
                    <div className="space-y-1 text-sm text-gray-600">
                      {question.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            question.correctAnswers.includes(option)
                              ? 'bg-green-100 text-green-600 font-bold'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className={question.correctAnswers.includes(option) ? 'text-green-600 font-medium' : ''}>
                            {option}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.explanation && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  )}
                  
                  {question.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {question.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={selectedSamples.has(question.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      const newSelected = new Set(selectedSamples);
                      if (e.target.checked) {
                        newSelected.add(question.id);
                      } else {
                        newSelected.delete(question.id);
                      }
                      setSelectedSamples(newSelected);
                    }}
                    className="w-4 h-4 text-blue-600"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderTestCreator = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enhanced Test Creator</h2>
          <p className="text-gray-600">Create comprehensive tests with image support and sample questions</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('sample-bank')}
            className="btn btn-secondary"
          >
            📚 Question Bank
          </button>
          <button
            onClick={() => setActiveView('preview')}
            className="btn btn-secondary"
            disabled={sections.every(s => s.questions.length === 0)}
          >
            👁️ Preview
          </button>
        </div>
      </div>

      {/* Test Metadata */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Test Title *</label>
            <input
              type="text"
              className="form-input focus-ring"
              value={testData.title}
              onChange={(e) => setTestData({ ...testData, title: e.target.value })}
              placeholder="Enter test title"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Duration (minutes)</label>
            <input
              type="number"
              className="form-input focus-ring"
              value={testData.duration}
              onChange={(e) => setTestData({ ...testData, duration: parseInt(e.target.value) })}
              min="1"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Passing Marks</label>
            <input
              type="number"
              className="form-input focus-ring"
              value={testData.passingMarks}
              onChange={(e) => setTestData({ ...testData, passingMarks: parseInt(e.target.value) })}
              min="0"
              max={testData.totalMarks}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Total Marks</label>
            <input
              type="number"
              className="form-input focus-ring"
              value={testData.totalMarks}
              disabled
              style={{ backgroundColor: '#f3f4f6' }}
            />
            <p className="text-xs text-gray-500 mt-1">Automatically calculated</p>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Test Description</label>
          <textarea
            className="form-textarea focus-ring"
            value={testData.description}
            onChange={(e) => setTestData({ ...testData, description: e.target.value })}
            placeholder="Brief description of the test..."
            rows={2}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Instructions for Students</label>
          <textarea
            className="form-textarea focus-ring"
            value={testData.instructions}
            onChange={(e) => setTestData({ ...testData, instructions: e.target.value })}
            placeholder="Special instructions, rules, or guidelines..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={testData.allowReview}
              onChange={(e) => setTestData({ ...testData, allowReview: e.target.checked })}
              className="mr-2"
            />
            Allow question review
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={testData.shuffleQuestions}
              onChange={(e) => setTestData({ ...testData, shuffleQuestions: e.target.checked })}
              className="mr-2"
            />
            Shuffle questions
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={testData.showResults}
              onChange={(e) => setTestData({ ...testData, showResults: e.target.checked })}
              className="mr-2"
            />
            Show results after submission
          </label>
        </div>
      </div>

      {/* Sections Management */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Test Sections</h3>
          <button
            onClick={addSection}
            className="btn btn-primary btn-sm"
          >
            + Add Section
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex space-x-2 mb-4 border-b border-gray-200">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSectionId(section.id)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeSectionId === section.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {section.title} ({section.questions.length})
            </button>
          ))}
        </div>

        {/* Active Section */}
        {sections.map((section) => (
          <div
            key={section.id}
            className={activeSectionId === section.id ? 'block' : 'hidden'}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="form-label">Section Title</label>
                <input
                  type="text"
                  className="form-input focus-ring"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Section Description</label>
                <input
                  type="text"
                  className="form-input focus-ring"
                  value={section.description}
                  onChange={(e) => updateSection(section.id, { description: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowQuestionForm(true)}
                  className="btn btn-primary btn-sm"
                >
                  ➕ Add Question
                </button>
                <button
                  onClick={() => setActiveView('sample-bank')}
                  className="btn btn-secondary btn-sm"
                >
                  📚 Browse Sample Questions
                </button>
              </div>
              
              {sections.length > 1 && (
                <button
                  onClick={() => deleteSection(section.id)}
                  className="btn btn-danger btn-sm"
                >
                  🗑️ Delete Section
                </button>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              {section.questions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📝</div>
                  <p>No questions added yet</p>
                </div>
              ) : (
                section.questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-gray-900">Q{index + 1}.</span>
                          <span className="badge badge-info">{question.type}</span>
                          <span className={`badge ${
                            question.difficulty === 'EASY' ? 'badge-success' :
                            question.difficulty === 'MEDIUM' ? 'badge-warning' : 'badge-danger'
                          }`}>
                            {question.difficulty}
                          </span>
                          <span className="text-sm text-gray-600">{question.marks} marks</span>
                        </div>
                        
                        <p className="text-gray-900 mb-2">{question.text}</p>
                        
                        {question.imageUrl && (
                          <img 
                            src={question.imageUrl} 
                            alt="Question" 
                            className="max-w-md rounded border mb-2"
                          />
                        )}
                        
                        {question.type === 'MCQ' && (
                          <div className="space-y-1 text-sm">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center space-x-2">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                  question.correctAnswers.includes(option)
                                    ? 'bg-green-100 text-green-600 font-bold'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {String.fromCharCode(65 + optIndex)}
                                </span>
                                <span className={question.correctAnswers.includes(option) ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                  {option}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {question.type !== 'MCQ' && (
                          <div className="text-sm">
                            <span className="text-green-600 font-medium">Correct Answer: {question.correctAnswers[0]}</span>
                          </div>
                        )}
                        
                        {question.explanation && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                            <strong>Explanation:</strong> {question.explanation}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => {
                            setEditingQuestion(question);
                            setShowQuestionForm(true);
                          }}
                          className="btn btn-sm btn-secondary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteQuestion(section.id, question.id)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={handleTestSubmit}
          disabled={loading || sections.every(s => s.questions.length === 0)}
          className="btn btn-primary btn-lg btn-animated"
        >
          {loading ? 'Creating Test...' : 'Create Test'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fade-in">
      {/* Navigation */}
      <div className="mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          {[
            { key: 'creator', label: 'Test Creator', icon: '✏️' },
            { key: 'sample-bank', label: 'Question Bank', icon: '📚' },
            ...(sections.some(s => s.questions.length > 0) ? [{ key: 'preview', label: 'Preview', icon: '👁️' }] : [])
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
      {activeView === 'creator' && renderTestCreator()}
      {activeView === 'sample-bank' && renderSampleQuestionsBank()}
      {activeView === 'preview' && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-6xl mb-4">🔄</div>
          <p>Preview functionality coming soon!</p>
        </div>
      )}

      {/* Question Form Modal */}
      {showQuestionForm && renderQuestionForm()}
    </div>
  );
};

export default TestCreatorEnhanced;