import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Enhanced Question Types like Google Forms
type QuestionType = 
  | 'MCQ'           // Multiple Choice (Single)
  | 'MULTIPLE_SELECT' // Multiple Choice (Multiple Correct)
  | 'SHORT_ANSWER'    // Short Text
  | 'LONG_ANSWER'     // Paragraph/Description
  | 'FILL_BLANKS'     // Fill in the blanks
  | 'MATCHING'        // Match the following
  | 'TRUE_FALSE'      // True/False
  | 'RANKING'         // Rank in order
  | 'SCALE'           // Rating scale (1-10)
  | 'DATE'            // Date picker
  | 'NUMBER'          // Number input

interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  imageUrl?: string;
  
  // For MCQ and Multiple Select
  options?: string[];
  correctAnswers?: string[];
  
  // For Fill in blanks
  textWithBlanks?: string;
  blankAnswers?: string[];
  
  // For Matching
  leftItems?: string[];
  rightItems?: string[];
  matchPairs?: { left: string; right: string }[];
  
  // For True/False
  correctAnswer?: boolean;
  
  // For Ranking
  itemsToRank?: string[];
  correctOrder?: string[];
  
  // For Scale
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: { min: string; max: string };
  
  // General
  points: number;
  explanation?: string;
  tags: string[];
}

interface TestSection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

interface TestSettings {
  title: string;
  description: string;
  duration: number; // in minutes
  totalPoints: number;
  passingScore: number;
  instructions: string;
  
  // Advanced settings
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResultsImmediately: boolean;
  allowReview: boolean;
  requireLogin: boolean;
  limitAttempts: number;
  
  // Timing
  scheduledStart?: string;
  scheduledEnd?: string;
  timePerQuestion?: number;
  
  // Security
  preventCopyPaste: boolean;
  fullScreenMode: boolean;
  randomizeOrder: boolean;
}

const AcadmateTestCreator: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'settings' | 'questions' | 'preview'>('settings');
  
  const [testSettings, setTestSettings] = useState<TestSettings>({
    title: '',
    description: '',
    duration: 60,
    totalPoints: 0,
    passingScore: 50,
    instructions: '',
    shuffleQuestions: false,
    shuffleOptions: false,
    showResultsImmediately: true,
    allowReview: true,
    requireLogin: true,
    limitAttempts: 1,
    preventCopyPaste: false,
    fullScreenMode: false,
    randomizeOrder: false
  });
  
  const [sections, setSections] = useState<TestSection[]>([
    { id: '1', title: 'Section 1', description: '', questions: [] }
  ]);
  
  const [activeSection, setActiveSection] = useState('1');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  // Question Type Options
  const questionTypes = [
    { value: 'MCQ', label: 'Multiple Choice (Single)', icon: '⚪', description: 'Choose one option' },
    { value: 'MULTIPLE_SELECT', label: 'Multiple Choice (Multiple)', icon: '☑️', description: 'Choose multiple options' },
    { value: 'SHORT_ANSWER', label: 'Short Answer', icon: '📝', description: 'Brief text response' },
    { value: 'LONG_ANSWER', label: 'Paragraph', icon: '📄', description: 'Detailed response' },
    { value: 'FILL_BLANKS', label: 'Fill in the Blanks', icon: '▢', description: 'Complete the sentence' },
    { value: 'MATCHING', label: 'Match the Following', icon: '🔗', description: 'Connect related items' },
    { value: 'TRUE_FALSE', label: 'True/False', icon: '✓', description: 'True or false question' },
    { value: 'RANKING', label: 'Rank Order', icon: '📊', description: 'Put items in order' },
    { value: 'SCALE', label: 'Rating Scale', icon: '⭐', description: '1-10 rating' },
    { value: 'DATE', label: 'Date', icon: '📅', description: 'Select a date' },
    { value: 'NUMBER', label: 'Number', icon: '🔢', description: 'Numeric answer' }
  ];

  // Calculate total points
  useEffect(() => {
    const total = sections.reduce((sum, section) => 
      sum + section.questions.reduce((qSum, q) => qSum + q.points, 0), 0
    );
    setTestSettings(prev => ({ ...prev, totalPoints: total }));
  }, [sections]);

  const addSection = () => {
    const newId = (sections.length + 1).toString();
    const newSection: TestSection = {
      id: newId,
      title: `Section ${sections.length + 1}`,
      description: '',
      questions: []
    };
    setSections([...sections, newSection]);
  };

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      title: '',
      required: true,
      points: type === 'MCQ' ? 2 : type === 'MULTIPLE_SELECT' ? 3 : type === 'LONG_ANSWER' ? 5 : 2,
      tags: [],
      options: ['MCQ', 'MULTIPLE_SELECT'].includes(type) ? ['Option 1', 'Option 2', 'Option 3', 'Option 4'] : undefined,
      correctAnswers: ['MCQ', 'MULTIPLE_SELECT'].includes(type) ? [] : undefined,
      leftItems: type === 'MATCHING' ? ['Item 1', 'Item 2'] : undefined,
      rightItems: type === 'MATCHING' ? ['Match A', 'Match B'] : undefined,
      itemsToRank: type === 'RANKING' ? ['First', 'Second', 'Third'] : undefined,
      scaleMin: type === 'SCALE' ? 1 : undefined,
      scaleMax: type === 'SCALE' ? 10 : undefined,
      scaleLabels: type === 'SCALE' ? { min: 'Poor', max: 'Excellent' } : undefined
    };
    
    setEditingQuestion(newQuestion);
    setShowQuestionModal(true);
  };

  const saveQuestion = (question: Question) => {
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === activeSection 
          ? {
              ...section,
              questions: editingQuestion?.id === question.id 
                ? section.questions.map(q => q.id === question.id ? question : q)
                : [...section.questions, question]
            }
          : section
      )
    );
    
    setShowQuestionModal(false);
    setEditingQuestion(null);
    toast.success('Question saved successfully!');
  };

  const renderQuestionEditor = () => {
    if (!editingQuestion) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {questionTypes.find(t => t.value === editingQuestion.type)?.icon} {' '}
                {questionTypes.find(t => t.value === editingQuestion.type)?.label}
              </h3>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Question Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Title *
              </label>
              <input
                type="text"
                value={editingQuestion.title}
                onChange={(e) => setEditingQuestion({...editingQuestion, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your question here..."
              />
            </div>

            {/* Question Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={editingQuestion.description || ''}
                onChange={(e) => setEditingQuestion({...editingQuestion, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Additional context or instructions..."
              />
            </div>

            {/* Question Type Specific Fields */}
            {(['MCQ', 'MULTIPLE_SELECT'] as const).includes(editingQuestion.type) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options
                </label>
                <div className="space-y-2">
                  {(editingQuestion.options || []).map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type={editingQuestion.type === 'MCQ' ? 'radio' : 'checkbox'}
                        name="correct-answer"
                        checked={editingQuestion.correctAnswers?.includes(option) || false}
                        onChange={(e) => {
                          const currentCorrect = editingQuestion.correctAnswers || [];
                          let newCorrect;
                          
                          if (editingQuestion.type === 'MCQ') {
                            newCorrect = e.target.checked ? [option] : [];
                          } else {
                            newCorrect = e.target.checked 
                              ? [...currentCorrect, option]
                              : currentCorrect.filter(a => a !== option);
                          }
                          
                          setEditingQuestion({...editingQuestion, correctAnswers: newCorrect});
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(editingQuestion.options || [])];
                          newOptions[index] = e.target.value;
                          setEditingQuestion({...editingQuestion, options: newOptions});
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Option ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newOptions = editingQuestion.options?.filter((_, i) => i !== index);
                          setEditingQuestion({...editingQuestion, options: newOptions});
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newOptions = [...(editingQuestion.options || []), `Option ${(editingQuestion.options?.length || 0) + 1}`];
                      setEditingQuestion({...editingQuestion, options: newOptions});
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Option
                  </button>
                </div>
              </div>
            )}

            {editingQuestion.type === 'FILL_BLANKS' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text with Blanks
                </label>
                <textarea
                  value={editingQuestion.textWithBlanks || ''}
                  onChange={(e) => setEditingQuestion({...editingQuestion, textWithBlanks: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Use _____ for blanks. Example: The capital of France is _____."
                />
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Answers for blanks (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editingQuestion.blankAnswers?.join(', ') || ''}
                    onChange={(e) => setEditingQuestion({
                      ...editingQuestion, 
                      blankAnswers: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Paris, London, Tokyo"
                  />
                </div>
              </div>
            )}

            {editingQuestion.type === 'MATCHING' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Left Items
                  </label>
                  {(editingQuestion.leftItems || []).map((item, index) => (
                    <input
                      key={index}
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...(editingQuestion.leftItems || [])];
                        newItems[index] = e.target.value;
                        setEditingQuestion({...editingQuestion, leftItems: newItems});
                      }}
                      className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Left item ${index + 1}`}
                    />
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Right Items
                  </label>
                  {(editingQuestion.rightItems || []).map((item, index) => (
                    <input
                      key={index}
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...(editingQuestion.rightItems || [])];
                        newItems[index] = e.target.value;
                        setEditingQuestion({...editingQuestion, rightItems: newItems});
                      }}
                      className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Right item ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {editingQuestion.type === 'TRUE_FALSE' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correct Answer
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="true-false"
                      checked={editingQuestion.correctAnswer === true}
                      onChange={() => setEditingQuestion({...editingQuestion, correctAnswer: true})}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-green-600 font-medium">True</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="true-false"
                      checked={editingQuestion.correctAnswer === false}
                      onChange={() => setEditingQuestion({...editingQuestion, correctAnswer: false})}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-2 text-red-600 font-medium">False</span>
                  </label>
                </div>
              </div>
            )}

            {editingQuestion.type === 'SCALE' && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Value
                  </label>
                  <input
                    type="number"
                    value={editingQuestion.scaleMin || 1}
                    onChange={(e) => setEditingQuestion({...editingQuestion, scaleMin: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Value
                  </label>
                  <input
                    type="number"
                    value={editingQuestion.scaleMax || 10}
                    onChange={(e) => setEditingQuestion({...editingQuestion, scaleMax: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Labels
                  </label>
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={editingQuestion.scaleLabels?.min || ''}
                      onChange={(e) => setEditingQuestion({
                        ...editingQuestion, 
                        scaleLabels: {...editingQuestion.scaleLabels, min: e.target.value}
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Min label"
                    />
                    <input
                      type="text"
                      value={editingQuestion.scaleLabels?.max || ''}
                      onChange={(e) => setEditingQuestion({
                        ...editingQuestion, 
                        scaleLabels: {...editingQuestion.scaleLabels, max: e.target.value}
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Max label"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Common Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points
                </label>
                <input
                  type="number"
                  value={editingQuestion.points}
                  onChange={(e) => setEditingQuestion({...editingQuestion, points: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingQuestion.required}
                    onChange={(e) => setEditingQuestion({...editingQuestion, required: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Required Question</span>
                </label>
              </div>
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explanation (Optional)
              </label>
              <textarea
                value={editingQuestion.explanation || ''}
                onChange={(e) => setEditingQuestion({...editingQuestion, explanation: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Explanation for the correct answer..."
              />
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowQuestionModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => saveQuestion(editingQuestion)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Question
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🎓 Acadmate Test Creator
              </h1>
              <p className="text-gray-600">
                Create comprehensive tests with multiple question types - just like Google Forms!
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Points</div>
              <div className="text-2xl font-bold text-blue-600">{testSettings.totalPoints}</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'settings', label: 'Test Settings', icon: '⚙️' },
                { key: 'questions', label: 'Questions', icon: '❓' },
                { key: 'preview', label: 'Preview', icon: '👁️' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setCurrentView(tab.key as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    currentView === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {currentView === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Test Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Title *
                    </label>
                    <input
                      type="text"
                      value={testSettings.title}
                      onChange={(e) => setTestSettings({...testSettings, title: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter test title..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={testSettings.duration}
                      onChange={(e) => setTestSettings({...testSettings, duration: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={testSettings.description}
                    onChange={(e) => setTestSettings({...testSettings, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Describe your test..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions for Students
                  </label>
                  <textarea
                    value={testSettings.instructions}
                    onChange={(e) => setTestSettings({...testSettings, instructions: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Instructions, rules, and guidelines for students..."
                  />
                </div>

                {/* Advanced Settings */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={testSettings.shuffleQuestions}
                        onChange={(e) => setTestSettings({...testSettings, shuffleQuestions: e.target.checked})}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Shuffle Questions</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={testSettings.allowReview}
                        onChange={(e) => setTestSettings({...testSettings, allowReview: e.target.checked})}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Allow Review</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={testSettings.preventCopyPaste}
                        onChange={(e) => setTestSettings({...testSettings, preventCopyPaste: e.target.checked})}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Prevent Copy/Paste</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={testSettings.fullScreenMode}
                        onChange={(e) => setTestSettings({...testSettings, fullScreenMode: e.target.checked})}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Full Screen Mode</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={testSettings.showResultsImmediately}
                        onChange={(e) => setTestSettings({...testSettings, showResultsImmediately: e.target.checked})}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Show Results Immediately</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={testSettings.randomizeOrder}
                        onChange={(e) => setTestSettings({...testSettings, randomizeOrder: e.target.checked})}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Randomize Order</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'questions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Questions</h2>
                  <button
                    onClick={addSection}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    + Add Section
                  </button>
                </div>

                {/* Section Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeSection === section.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {section.title} ({section.questions.length})
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Question Types Grid */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Question</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {questionTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => addQuestion(type.value as QuestionType)}
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <div className="font-medium text-sm text-gray-900 group-hover:text-blue-600">
                            {type.label}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {type.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Questions List */}
                {sections.find(s => s.id === activeSection)?.questions.map((question, index) => (
                  <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xl">
                            {questionTypes.find(t => t.value === question.type)?.icon}
                          </span>
                          <span className="font-semibold text-gray-900">
                            Q{index + 1}. {question.title || 'Untitled Question'}
                          </span>
                          <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                            {question.points} pts
                          </span>
                          {question.required && (
                            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                              Required
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm">
                          {questionTypes.find(t => t.value === question.type)?.label}
                        </p>
                        
                        {question.description && (
                          <p className="text-gray-600 text-sm mt-1">{question.description}</p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingQuestion(question);
                            setShowQuestionModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSections(sections.map(s => 
                              s.id === activeSection 
                                ? { ...s, questions: s.questions.filter(q => q.id !== question.id) }
                                : s
                            ));
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {sections.find(s => s.id === activeSection)?.questions.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">📝</div>
                    <p>No questions added yet. Choose a question type above to get started!</p>
                  </div>
                )}
              </div>
            )}

            {currentView === 'preview' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Test Preview</h2>
                <div className="bg-gray-100 p-8 rounded-lg">
                  <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      {testSettings.title || 'Untitled Test'}
                    </h1>
                    <p className="text-gray-600 mb-6">{testSettings.description}</p>
                    
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
                      <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
                      <p className="text-blue-800">{testSettings.instructions}</p>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>⏱️ Duration: {testSettings.duration} minutes</p>
                        <p>🎯 Total Points: {testSettings.totalPoints}</p>
                      </div>
                    </div>

                    {sections.map((section) => (
                      <div key={section.id} className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                          {section.title}
                        </h2>
                        {section.description && (
                          <p className="text-gray-600 mb-4">{section.description}</p>
                        )}
                        
                        {section.questions.map((question, index) => (
                          <div key={question.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {index + 1}. {question.title}
                                {question.required && <span className="text-red-500 ml-1">*</span>}
                              </h3>
                              <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                {question.points} pts
                              </span>
                            </div>
                            
                            {question.description && (
                              <p className="text-gray-600 text-sm mb-3">{question.description}</p>
                            )}
                            
                            <div className="text-sm text-gray-500 mb-2">
                              Type: {questionTypes.find(t => t.value === question.type)?.label}
                            </div>
                            
                            {/* Preview would show question interface here */}
                            <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
                              Question interface would appear here for students
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={() => {
              // Here you would save to backend
              toast.success('Test saved successfully!');
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-semibold"
          >
            💾 Save Test
          </button>
        </div>

        {/* Question Editor Modal */}
        {showQuestionModal && renderQuestionEditor()}
      </div>
    </div>
  );
};

export default AcadmateTestCreator;