import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
const AcadmateTestCreator = () => {
    const { user } = useAuth();
    const [currentView, setCurrentView] = useState('settings');
    const [testSettings, setTestSettings] = useState({
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
    const [sections, setSections] = useState([
        { id: '1', title: 'Section 1', description: '', questions: [] }
    ]);
    const [activeSection, setActiveSection] = useState('1');
    const [editingQuestion, setEditingQuestion] = useState(null);
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
        const total = sections.reduce((sum, section) => sum + section.questions.reduce((qSum, q) => qSum + q.points, 0), 0);
        setTestSettings(prev => ({ ...prev, totalPoints: total }));
    }, [sections]);
    const addSection = () => {
        const newId = (sections.length + 1).toString();
        const newSection = {
            id: newId,
            title: `Section ${sections.length + 1}`,
            description: '',
            questions: []
        };
        setSections([...sections, newSection]);
    };
    const addQuestion = (type) => {
        const newQuestion = {
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
    const saveQuestion = (question) => {
        setSections(prevSections => prevSections.map(section => section.id === activeSection
            ? {
                ...section,
                questions: editingQuestion?.id === question.id
                    ? section.questions.map(q => q.id === question.id ? question : q)
                    : [...section.questions, question]
            }
            : section));
        setShowQuestionModal(false);
        setEditingQuestion(null);
        toast.success('Question saved successfully!');
    };
    const renderQuestionEditor = () => {
        if (!editingQuestion)
            return null;
        return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h3", { className: "text-xl font-bold text-gray-900", children: [questionTypes.find(t => t.value === editingQuestion.type)?.icon, " ", ' ', questionTypes.find(t => t.value === editingQuestion.type)?.label] }), _jsx("button", { onClick: () => setShowQuestionModal(false), className: "text-gray-400 hover:text-gray-600 text-2xl", children: "\u00D7" })] }) }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Question Title *" }), _jsx("input", { type: "text", value: editingQuestion.title, onChange: (e) => setEditingQuestion({ ...editingQuestion, title: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "Enter your question here..." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description (Optional)" }), _jsx("textarea", { value: editingQuestion.description || '', onChange: (e) => setEditingQuestion({ ...editingQuestion, description: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", rows: 2, placeholder: "Additional context or instructions..." })] }), ['MCQ', 'MULTIPLE_SELECT'].includes(editingQuestion.type) && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Options" }), _jsxs("div", { className: "space-y-2", children: [(editingQuestion.options || []).map((option, index) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: editingQuestion.type === 'MCQ' ? 'radio' : 'checkbox', name: "correct-answer", checked: editingQuestion.correctAnswers?.includes(option) || false, onChange: (e) => {
                                                            const currentCorrect = editingQuestion.correctAnswers || [];
                                                            let newCorrect;
                                                            if (editingQuestion.type === 'MCQ') {
                                                                newCorrect = e.target.checked ? [option] : [];
                                                            }
                                                            else {
                                                                newCorrect = e.target.checked
                                                                    ? [...currentCorrect, option]
                                                                    : currentCorrect.filter(a => a !== option);
                                                            }
                                                            setEditingQuestion({ ...editingQuestion, correctAnswers: newCorrect });
                                                        }, className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("input", { type: "text", value: option, onChange: (e) => {
                                                            const newOptions = [...(editingQuestion.options || [])];
                                                            newOptions[index] = e.target.value;
                                                            setEditingQuestion({ ...editingQuestion, options: newOptions });
                                                        }, className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: `Option ${index + 1}` }), _jsx("button", { type: "button", onClick: () => {
                                                            const newOptions = editingQuestion.options?.filter((_, i) => i !== index);
                                                            setEditingQuestion({ ...editingQuestion, options: newOptions });
                                                        }, className: "text-red-500 hover:text-red-700", children: "\uD83D\uDDD1\uFE0F" })] }, index))), _jsx("button", { type: "button", onClick: () => {
                                                    const newOptions = [...(editingQuestion.options || []), `Option ${(editingQuestion.options?.length || 0) + 1}`];
                                                    setEditingQuestion({ ...editingQuestion, options: newOptions });
                                                }, className: "text-blue-600 hover:text-blue-800 text-sm", children: "+ Add Option" })] })] })), editingQuestion.type === 'FILL_BLANKS' && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Text with Blanks" }), _jsx("textarea", { value: editingQuestion.textWithBlanks || '', onChange: (e) => setEditingQuestion({ ...editingQuestion, textWithBlanks: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", rows: 3, placeholder: "Use _____ for blanks. Example: The capital of France is _____." }), _jsxs("div", { className: "mt-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Answers for blanks (comma-separated)" }), _jsx("input", { type: "text", value: editingQuestion.blankAnswers?.join(', ') || '', onChange: (e) => setEditingQuestion({
                                                    ...editingQuestion,
                                                    blankAnswers: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                                }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "Paris, London, Tokyo" })] })] })), editingQuestion.type === 'MATCHING' && (_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Left Items" }), (editingQuestion.leftItems || []).map((item, index) => (_jsx("input", { type: "text", value: item, onChange: (e) => {
                                                    const newItems = [...(editingQuestion.leftItems || [])];
                                                    newItems[index] = e.target.value;
                                                    setEditingQuestion({ ...editingQuestion, leftItems: newItems });
                                                }, className: "w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: `Left item ${index + 1}` }, index)))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Right Items" }), (editingQuestion.rightItems || []).map((item, index) => (_jsx("input", { type: "text", value: item, onChange: (e) => {
                                                    const newItems = [...(editingQuestion.rightItems || [])];
                                                    newItems[index] = e.target.value;
                                                    setEditingQuestion({ ...editingQuestion, rightItems: newItems });
                                                }, className: "w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: `Right item ${index + 1}` }, index)))] })] })), editingQuestion.type === 'TRUE_FALSE' && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Correct Answer" }), _jsxs("div", { className: "flex space-x-4", children: [_jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "radio", name: "true-false", checked: editingQuestion.correctAnswer === true, onChange: () => setEditingQuestion({ ...editingQuestion, correctAnswer: true }), className: "w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" }), _jsx("span", { className: "ml-2 text-green-600 font-medium", children: "True" })] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "radio", name: "true-false", checked: editingQuestion.correctAnswer === false, onChange: () => setEditingQuestion({ ...editingQuestion, correctAnswer: false }), className: "w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" }), _jsx("span", { className: "ml-2 text-red-600 font-medium", children: "False" })] })] })] })), editingQuestion.type === 'SCALE' && (_jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Min Value" }), _jsx("input", { type: "number", value: editingQuestion.scaleMin || 1, onChange: (e) => setEditingQuestion({ ...editingQuestion, scaleMin: parseInt(e.target.value) }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Max Value" }), _jsx("input", { type: "number", value: editingQuestion.scaleMax || 10, onChange: (e) => setEditingQuestion({ ...editingQuestion, scaleMax: parseInt(e.target.value) }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Labels" }), _jsxs("div", { className: "space-y-1", children: [_jsx("input", { type: "text", value: editingQuestion.scaleLabels?.min || '', onChange: (e) => setEditingQuestion({
                                                            ...editingQuestion,
                                                            scaleLabels: { ...editingQuestion.scaleLabels, min: e.target.value }
                                                        }), className: "w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500", placeholder: "Min label" }), _jsx("input", { type: "text", value: editingQuestion.scaleLabels?.max || '', onChange: (e) => setEditingQuestion({
                                                            ...editingQuestion,
                                                            scaleLabels: { ...editingQuestion.scaleLabels, max: e.target.value }
                                                        }), className: "w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500", placeholder: "Max label" })] })] })] })), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Points" }), _jsx("input", { type: "number", value: editingQuestion.points, onChange: (e) => setEditingQuestion({ ...editingQuestion, points: parseInt(e.target.value) || 0 }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", min: "0" })] }), _jsx("div", { className: "flex items-center", children: _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: editingQuestion.required, onChange: (e) => setEditingQuestion({ ...editingQuestion, required: e.target.checked }), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "ml-2 text-sm font-medium text-gray-700", children: "Required Question" })] }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Explanation (Optional)" }), _jsx("textarea", { value: editingQuestion.explanation || '', onChange: (e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", rows: 2, placeholder: "Explanation for the correct answer..." })] })] }), _jsxs("div", { className: "p-6 border-t border-gray-200 flex justify-end space-x-3", children: [_jsx("button", { type: "button", onClick: () => setShowQuestionModal(false), className: "px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50", children: "Cancel" }), _jsx("button", { type: "button", onClick: () => saveQuestion(editingQuestion), className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: "Save Question" })] })] }) }));
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [_jsx("div", { className: "bg-white rounded-xl shadow-sm border p-6 mb-8", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "\uD83C\uDF93 Acadmate Test Creator" }), _jsx("p", { className: "text-gray-600", children: "Create comprehensive tests with multiple question types - just like Google Forms!" })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-sm text-gray-500", children: "Total Points" }), _jsx("div", { className: "text-2xl font-bold text-blue-600", children: testSettings.totalPoints })] })] }) }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border mb-8", children: [_jsx("div", { className: "border-b border-gray-200", children: _jsx("nav", { className: "flex space-x-8 px-6", children: [
                                    { key: 'settings', label: 'Test Settings', icon: '⚙️' },
                                    { key: 'questions', label: 'Questions', icon: '❓' },
                                    { key: 'preview', label: 'Preview', icon: '👁️' }
                                ].map((tab) => (_jsxs("button", { onClick: () => setCurrentView(tab.key), className: `py-4 px-2 border-b-2 font-medium text-sm ${currentView === tab.key
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: [tab.icon, " ", tab.label] }, tab.key))) }) }), _jsxs("div", { className: "p-6", children: [currentView === 'settings' && (_jsxs("div", { className: "space-y-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Test Settings" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Test Title *" }), _jsx("input", { type: "text", value: testSettings.title, onChange: (e) => setTestSettings({ ...testSettings, title: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "Enter test title..." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Duration (minutes)" }), _jsx("input", { type: "number", value: testSettings.duration, onChange: (e) => setTestSettings({ ...testSettings, duration: parseInt(e.target.value) }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", min: "1" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }), _jsx("textarea", { value: testSettings.description, onChange: (e) => setTestSettings({ ...testSettings, description: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", rows: 3, placeholder: "Describe your test..." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Instructions for Students" }), _jsx("textarea", { value: testSettings.instructions, onChange: (e) => setTestSettings({ ...testSettings, instructions: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", rows: 4, placeholder: "Instructions, rules, and guidelines for students..." })] }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Advanced Settings" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [_jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: testSettings.shuffleQuestions, onChange: (e) => setTestSettings({ ...testSettings, shuffleQuestions: e.target.checked }), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "ml-2 text-sm text-gray-700", children: "Shuffle Questions" })] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: testSettings.allowReview, onChange: (e) => setTestSettings({ ...testSettings, allowReview: e.target.checked }), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "ml-2 text-sm text-gray-700", children: "Allow Review" })] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: testSettings.preventCopyPaste, onChange: (e) => setTestSettings({ ...testSettings, preventCopyPaste: e.target.checked }), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "ml-2 text-sm text-gray-700", children: "Prevent Copy/Paste" })] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: testSettings.fullScreenMode, onChange: (e) => setTestSettings({ ...testSettings, fullScreenMode: e.target.checked }), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "ml-2 text-sm text-gray-700", children: "Full Screen Mode" })] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: testSettings.showResultsImmediately, onChange: (e) => setTestSettings({ ...testSettings, showResultsImmediately: e.target.checked }), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "ml-2 text-sm text-gray-700", children: "Show Results Immediately" })] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: testSettings.randomizeOrder, onChange: (e) => setTestSettings({ ...testSettings, randomizeOrder: e.target.checked }), className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("span", { className: "ml-2 text-sm text-gray-700", children: "Randomize Order" })] })] })] })] })), currentView === 'questions' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Questions" }), _jsx("button", { onClick: addSection, className: "px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700", children: "+ Add Section" })] }), _jsx("div", { className: "border-b border-gray-200", children: _jsx("nav", { className: "flex space-x-8", children: sections.map((section) => (_jsxs("button", { onClick: () => setActiveSection(section.id), className: `py-2 px-1 border-b-2 font-medium text-sm ${activeSection === section.id
                                                        ? 'border-blue-500 text-blue-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700'}`, children: [section.title, " (", section.questions.length, ")"] }, section.id))) }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Add Question" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: questionTypes.map((type) => (_jsx("button", { onClick: () => addQuestion(type.value), className: "p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl mb-2", children: type.icon }), _jsx("div", { className: "font-medium text-sm text-gray-900 group-hover:text-blue-600", children: type.label }), _jsx("div", { className: "text-xs text-gray-500 mt-1", children: type.description })] }) }, type.value))) })] }), sections.find(s => s.id === activeSection)?.questions.map((question, index) => (_jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-6", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx("span", { className: "text-xl", children: questionTypes.find(t => t.value === question.type)?.icon }), _jsxs("span", { className: "font-semibold text-gray-900", children: ["Q", index + 1, ". ", question.title || 'Untitled Question'] }), _jsxs("span", { className: "text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded", children: [question.points, " pts"] }), question.required && (_jsx("span", { className: "text-xs text-red-600 bg-red-100 px-2 py-1 rounded", children: "Required" }))] }), _jsx("p", { className: "text-gray-600 text-sm", children: questionTypes.find(t => t.value === question.type)?.label }), question.description && (_jsx("p", { className: "text-gray-600 text-sm mt-1", children: question.description }))] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => {
                                                                    setEditingQuestion(question);
                                                                    setShowQuestionModal(true);
                                                                }, className: "text-blue-600 hover:text-blue-800 text-sm", children: "Edit" }), _jsx("button", { onClick: () => {
                                                                    setSections(sections.map(s => s.id === activeSection
                                                                        ? { ...s, questions: s.questions.filter(q => q.id !== question.id) }
                                                                        : s));
                                                                }, className: "text-red-600 hover:text-red-800 text-sm", children: "Delete" })] })] }) }, question.id))), sections.find(s => s.id === activeSection)?.questions.length === 0 && (_jsxs("div", { className: "text-center py-12 text-gray-500", children: [_jsx("div", { className: "text-4xl mb-4", children: "\uD83D\uDCDD" }), _jsx("p", { children: "No questions added yet. Choose a question type above to get started!" })] }))] })), currentView === 'preview' && (_jsxs("div", { className: "space-y-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Test Preview" }), _jsx("div", { className: "bg-gray-100 p-8 rounded-lg", children: _jsxs("div", { className: "max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-4", children: testSettings.title || 'Untitled Test' }), _jsx("p", { className: "text-gray-600 mb-6", children: testSettings.description }), _jsxs("div", { className: "bg-blue-50 border-l-4 border-blue-400 p-4 mb-8", children: [_jsx("h3", { className: "font-semibold text-blue-900 mb-2", children: "Instructions" }), _jsx("p", { className: "text-blue-800", children: testSettings.instructions }), _jsxs("div", { className: "mt-2 text-sm text-blue-700", children: [_jsxs("p", { children: ["\u23F1\uFE0F Duration: ", testSettings.duration, " minutes"] }), _jsxs("p", { children: ["\uD83C\uDFAF Total Points: ", testSettings.totalPoints] })] })] }), sections.map((section) => (_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900 mb-4", children: section.title }), section.description && (_jsx("p", { className: "text-gray-600 mb-4", children: section.description })), section.questions.map((question, index) => (_jsxs("div", { className: "mb-6 p-4 border border-gray-200 rounded-lg", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("h3", { className: "font-semibold text-gray-900", children: [index + 1, ". ", question.title, question.required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] }), _jsxs("span", { className: "text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded", children: [question.points, " pts"] })] }), question.description && (_jsx("p", { className: "text-gray-600 text-sm mb-3", children: question.description })), _jsxs("div", { className: "text-sm text-gray-500 mb-2", children: ["Type: ", questionTypes.find(t => t.value === question.type)?.label] }), _jsx("div", { className: "bg-gray-50 p-3 rounded text-sm text-gray-600", children: "Question interface would appear here for students" })] }, question.id)))] }, section.id)))] }) })] }))] })] }), _jsx("div", { className: "text-center", children: _jsx("button", { onClick: () => {
                            // Here you would save to backend
                            toast.success('Test saved successfully!');
                        }, className: "px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-semibold", children: "\uD83D\uDCBE Save Test" }) }), showQuestionModal && renderQuestionEditor()] }) }));
};
export default AcadmateTestCreator;
