import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
const TestCreatorEnhanced = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [activeView, setActiveView] = useState('creator');
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
    const [sections, setSections] = useState([
        {
            id: '1',
            title: 'Section A',
            description: 'Multiple Choice Questions',
            questions: []
        }
    ]);
    // Sample questions
    const [sampleQuestions, setSampleQuestions] = useState([]);
    const [sampleFilters, setSampleFilters] = useState({
        subject: '',
        class: '',
        difficulty: '',
        tags: ''
    });
    const [selectedSamples, setSelectedSamples] = useState(new Set());
    // UI state
    const [activeSectionId, setActiveSectionId] = useState('1');
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    useEffect(() => {
        fetchSampleQuestions();
    }, []);
    useEffect(() => {
        // Calculate total marks when sections change
        const total = sections.reduce((sum, section) => sum + section.questions.reduce((qSum, q) => qSum + q.marks, 0), 0);
        setTestData(prev => ({ ...prev, totalMarks: total }));
    }, [sections]);
    const fetchSampleQuestions = async () => {
        try {
            const response = await axios.get('/api/sample-questions', {
                params: sampleFilters
            });
            setSampleQuestions(response.data);
        }
        catch (error) {
            console.error('Error fetching sample questions:', error);
            toast.error('Failed to fetch sample questions');
        }
    };
    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await axios.post('/api/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.imageUrl;
        }
        catch (error) {
            console.error('Image upload failed:', error);
            throw new Error('Failed to upload image');
        }
    };
    const addSection = () => {
        const newSection = {
            id: Date.now().toString(),
            title: `Section ${String.fromCharCode(65 + sections.length)}`,
            description: 'New Section',
            questions: []
        };
        setSections([...sections, newSection]);
    };
    const updateSection = (sectionId, updates) => {
        setSections(sections.map(section => section.id === sectionId ? { ...section, ...updates } : section));
    };
    const deleteSection = (sectionId) => {
        if (sections.length <= 1) {
            toast.error('At least one section is required');
            return;
        }
        setSections(sections.filter(s => s.id !== sectionId));
        if (activeSectionId === sectionId) {
            setActiveSectionId(sections[0].id);
        }
    };
    const addQuestion = (sectionId, question) => {
        setSections(sections.map(section => section.id === sectionId
            ? { ...section, questions: [...section.questions, question] }
            : section));
    };
    const updateQuestion = (sectionId, questionId, updates) => {
        setSections(sections.map(section => section.id === sectionId
            ? {
                ...section,
                questions: section.questions.map(q => q.id === questionId ? { ...q, ...updates } : q)
            }
            : section));
    };
    const deleteQuestion = (sectionId, questionId) => {
        setSections(sections.map(section => section.id === sectionId
            ? { ...section, questions: section.questions.filter(q => q.id !== questionId) }
            : section));
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
        }));
        const activeSection = sections.find(s => s.id === activeSectionId);
        if (activeSection) {
            setSections(sections.map(section => section.id === activeSectionId
                ? { ...section, questions: [...section.questions, ...questionsToAdd] }
                : section));
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
            const sectionsWithImages = await Promise.all(sections.map(async (section) => ({
                ...section,
                questions: await Promise.all(section.questions.map(async (question) => {
                    if (question.imageFile) {
                        const imageUrl = await handleImageUpload(question.imageFile);
                        return { ...question, imageUrl, imageFile: undefined };
                    }
                    return question;
                }))
            })));
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
        }
        catch (error) {
            console.error('Error creating test:', error);
            toast.error(error.response?.data?.message || 'Failed to create test');
        }
        finally {
            setLoading(false);
        }
    };
    const renderQuestionForm = () => {
        const [questionData, setQuestionData] = useState(editingQuestion || {
            type: 'MCQ',
            text: '',
            options: ['', '', '', ''],
            correctAnswers: [''],
            explanation: '',
            marks: 4,
            negativeMarks: 1,
            difficulty: 'MEDIUM',
            tags: []
        });
        const handleSubmit = (e) => {
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
            const newQuestion = {
                id: editingQuestion?.id || Date.now().toString(),
                type: questionData.type,
                text: questionData.text,
                imageFile: questionData.imageFile,
                imageUrl: questionData.imageUrl,
                options: questionData.options || [],
                correctAnswers: questionData.correctAnswers,
                explanation: questionData.explanation || '',
                marks: questionData.marks || 1,
                negativeMarks: questionData.negativeMarks || 0,
                difficulty: questionData.difficulty || 'MEDIUM',
                tags: questionData.tags || []
            };
            if (editingQuestion) {
                updateQuestion(activeSectionId, editingQuestion.id, newQuestion);
            }
            else {
                addQuestion(activeSectionId, newQuestion);
            }
            setShowQuestionForm(false);
            setEditingQuestion(null);
        };
        return (_jsx("div", { className: "modal-overlay modal-backdrop", children: _jsxs("div", { className: "modal-content", style: { maxWidth: '800px' }, children: [_jsxs("div", { className: "modal-header", children: [_jsx("h3", { className: "modal-title", children: editingQuestion ? 'Edit Question' : 'Add New Question' }), _jsx("button", { onClick: () => {
                                    setShowQuestionForm(false);
                                    setEditingQuestion(null);
                                }, className: "modal-close", children: "\u00D7" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "modal-body space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Question Type" }), _jsxs("select", { className: "form-select focus-ring", value: questionData.type, onChange: (e) => setQuestionData({ ...questionData, type: e.target.value }), children: [_jsx("option", { value: "MCQ", children: "Multiple Choice" }), _jsx("option", { value: "SHORT_ANSWER", children: "Short Answer" }), _jsx("option", { value: "INTEGER", children: "Integer Type" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Difficulty" }), _jsxs("select", { className: "form-select focus-ring", value: questionData.difficulty, onChange: (e) => setQuestionData({ ...questionData, difficulty: e.target.value }), children: [_jsx("option", { value: "EASY", children: "Easy" }), _jsx("option", { value: "MEDIUM", children: "Medium" }), _jsx("option", { value: "HARD", children: "Hard" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Marks" }), _jsx("input", { type: "number", className: "form-input focus-ring", value: questionData.marks, onChange: (e) => setQuestionData({ ...questionData, marks: parseInt(e.target.value) }), min: "1", max: "20" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Negative Marks" }), _jsx("input", { type: "number", className: "form-input focus-ring", value: questionData.negativeMarks, onChange: (e) => setQuestionData({ ...questionData, negativeMarks: parseInt(e.target.value) }), min: "0", max: "10" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Question Text *" }), _jsx("textarea", { className: "form-textarea focus-ring", value: questionData.text, onChange: (e) => setQuestionData({ ...questionData, text: e.target.value }), placeholder: "Enter your question here...", rows: 3, required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Question Image (Optional)" }), _jsx("input", { type: "file", className: "form-input focus-ring", accept: "image/*", onChange: (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setQuestionData({ ...questionData, imageFile: file });
                                            }
                                        } }), questionData.imageFile && (_jsx("div", { className: "mt-2", children: _jsx("img", { src: URL.createObjectURL(questionData.imageFile), alt: "Preview", className: "max-w-xs rounded border" }) }))] }), questionData.type === 'MCQ' && (_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Options *" }), _jsx("div", { className: "space-y-2", children: (questionData.options || ['', '', '', '']).map((option, index) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium", children: String.fromCharCode(65 + index) }), _jsx("input", { type: "text", className: "form-input focus-ring flex-1", value: option, onChange: (e) => {
                                                        const newOptions = [...(questionData.options || [])];
                                                        newOptions[index] = e.target.value;
                                                        setQuestionData({ ...questionData, options: newOptions });
                                                    }, placeholder: `Option ${String.fromCharCode(65 + index)}` }), _jsx("input", { type: "checkbox", checked: questionData.correctAnswers?.includes(option), onChange: (e) => {
                                                        const correct = questionData.correctAnswers || [];
                                                        if (e.target.checked) {
                                                            setQuestionData({
                                                                ...questionData,
                                                                correctAnswers: [...correct, option]
                                                            });
                                                        }
                                                        else {
                                                            setQuestionData({
                                                                ...questionData,
                                                                correctAnswers: correct.filter(ans => ans !== option)
                                                            });
                                                        }
                                                    }, title: "Mark as correct answer" })] }, index))) })] })), questionData.type !== 'MCQ' && (_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Correct Answer *" }), _jsx("input", { type: "text", className: "form-input focus-ring", value: questionData.correctAnswers?.[0] || '', onChange: (e) => setQuestionData({
                                            ...questionData,
                                            correctAnswers: [e.target.value]
                                        }), placeholder: "Enter the correct answer", required: true })] })), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Explanation (Optional)" }), _jsx("textarea", { className: "form-textarea focus-ring", value: questionData.explanation, onChange: (e) => setQuestionData({ ...questionData, explanation: e.target.value }), placeholder: "Explain the correct answer...", rows: 2 })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Tags (comma-separated)" }), _jsx("input", { type: "text", className: "form-input focus-ring", value: questionData.tags?.join(', ') || '', onChange: (e) => setQuestionData({
                                            ...questionData,
                                            tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                                        }), placeholder: "algebra, geometry, calculus" })] })] }), _jsxs("div", { className: "modal-footer", children: [_jsx("button", { type: "button", onClick: () => {
                                    setShowQuestionForm(false);
                                    setEditingQuestion(null);
                                }, className: "btn btn-secondary", children: "Cancel" }), _jsx("button", { onClick: handleSubmit, className: "btn btn-primary btn-animated", children: editingQuestion ? 'Update Question' : 'Add Question' })] })] }) }));
    };
    const renderSampleQuestionsBank = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Sample Questions Bank" }), _jsx("p", { className: "text-gray-600", children: "Browse and add pre-made questions to your test" })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => setActiveView('creator'), className: "btn btn-secondary", children: "Back to Creator" }), selectedSamples.size > 0 && (_jsxs("button", { onClick: addSampleQuestionsToTest, className: "btn btn-primary", children: ["Add Selected (", selectedSamples.size, ")"] }))] })] }), _jsx("div", { className: "bg-white p-4 rounded-lg shadow-sm border", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Subject" }), _jsxs("select", { className: "form-select focus-ring", value: sampleFilters.subject, onChange: (e) => setSampleFilters({ ...sampleFilters, subject: e.target.value }), children: [_jsx("option", { value: "", children: "All Subjects" }), _jsx("option", { value: "Mathematics", children: "Mathematics" }), _jsx("option", { value: "Physics", children: "Physics" }), _jsx("option", { value: "Chemistry", children: "Chemistry" }), _jsx("option", { value: "Biology", children: "Biology" }), _jsx("option", { value: "English", children: "English" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Class" }), _jsxs("select", { className: "form-select focus-ring", value: sampleFilters.class, onChange: (e) => setSampleFilters({ ...sampleFilters, class: e.target.value }), children: [_jsx("option", { value: "", children: "All Classes" }), _jsx("option", { value: "7", children: "Class 7" }), _jsx("option", { value: "8", children: "Class 8" }), _jsx("option", { value: "9", children: "Class 9" }), _jsx("option", { value: "10", children: "Class 10" }), _jsx("option", { value: "11", children: "Class 11" }), _jsx("option", { value: "12", children: "Class 12" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Difficulty" }), _jsxs("select", { className: "form-select focus-ring", value: sampleFilters.difficulty, onChange: (e) => setSampleFilters({ ...sampleFilters, difficulty: e.target.value }), children: [_jsx("option", { value: "", children: "All Levels" }), _jsx("option", { value: "EASY", children: "Easy" }), _jsx("option", { value: "MEDIUM", children: "Medium" }), _jsx("option", { value: "HARD", children: "Hard" })] })] }), _jsx("div", { className: "flex items-end", children: _jsx("button", { onClick: fetchSampleQuestions, className: "btn btn-primary w-full", children: "Search Questions" }) })] }) }), _jsx("div", { className: "space-y-4", children: sampleQuestions.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDCDD" }), _jsx("p", { children: "No sample questions found. Try adjusting your filters." })] })) : (sampleQuestions.map((question) => (_jsx("div", { className: `card p-4 cursor-pointer transition-all ${selectedSamples.has(question.id)
                        ? 'ring-2 ring-blue-500 bg-blue-50'
                        : 'hover:shadow-md'}`, onClick: () => {
                        const newSelected = new Set(selectedSamples);
                        if (newSelected.has(question.id)) {
                            newSelected.delete(question.id);
                        }
                        else {
                            newSelected.add(question.id);
                        }
                        setSelectedSamples(newSelected);
                    }, children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx("span", { className: "badge badge-info", children: question.subject }), _jsxs("span", { className: "badge badge-secondary", children: ["Class ", question.class] }), _jsx("span", { className: `badge ${question.difficulty === 'EASY' ? 'badge-success' :
                                                    question.difficulty === 'MEDIUM' ? 'badge-warning' : 'badge-danger'}`, children: question.difficulty }), _jsx("span", { className: "badge badge-secondary", children: question.type })] }), _jsx("p", { className: "text-gray-900 mb-2", children: question.text }), question.type === 'MCQ' && (_jsx("div", { className: "space-y-1 text-sm text-gray-600", children: question.options.map((option, index) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: `w-6 h-6 rounded-full flex items-center justify-center text-xs ${question.correctAnswers.includes(option)
                                                        ? 'bg-green-100 text-green-600 font-bold'
                                                        : 'bg-gray-100 text-gray-600'}`, children: String.fromCharCode(65 + index) }), _jsx("span", { className: question.correctAnswers.includes(option) ? 'text-green-600 font-medium' : '', children: option })] }, index))) })), question.explanation && (_jsxs("div", { className: "mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600", children: [_jsx("strong", { children: "Explanation:" }), " ", question.explanation] })), question.tags.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: question.tags.map((tag, index) => (_jsx("span", { className: "px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded", children: tag }, index))) }))] }), _jsx("div", { className: "ml-4", children: _jsx("input", { type: "checkbox", checked: selectedSamples.has(question.id), onChange: (e) => {
                                        e.stopPropagation();
                                        const newSelected = new Set(selectedSamples);
                                        if (e.target.checked) {
                                            newSelected.add(question.id);
                                        }
                                        else {
                                            newSelected.delete(question.id);
                                        }
                                        setSelectedSamples(newSelected);
                                    }, className: "w-4 h-4 text-blue-600" }) })] }) }, question.id)))) })] }));
    const renderTestCreator = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Enhanced Test Creator" }), _jsx("p", { className: "text-gray-600", children: "Create comprehensive tests with image support and sample questions" })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => setActiveView('sample-bank'), className: "btn btn-secondary", children: "\uD83D\uDCDA Question Bank" }), _jsx("button", { onClick: () => setActiveView('preview'), className: "btn btn-secondary", disabled: sections.every(s => s.questions.length === 0), children: "\uD83D\uDC41\uFE0F Preview" })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Test Details" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Test Title *" }), _jsx("input", { type: "text", className: "form-input focus-ring", value: testData.title, onChange: (e) => setTestData({ ...testData, title: e.target.value }), placeholder: "Enter test title", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Duration (minutes)" }), _jsx("input", { type: "number", className: "form-input focus-ring", value: testData.duration, onChange: (e) => setTestData({ ...testData, duration: parseInt(e.target.value) }), min: "1" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Passing Marks" }), _jsx("input", { type: "number", className: "form-input focus-ring", value: testData.passingMarks, onChange: (e) => setTestData({ ...testData, passingMarks: parseInt(e.target.value) }), min: "0", max: testData.totalMarks })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Total Marks" }), _jsx("input", { type: "number", className: "form-input focus-ring", value: testData.totalMarks, disabled: true, style: { backgroundColor: '#f3f4f6' } }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Automatically calculated" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Test Description" }), _jsx("textarea", { className: "form-textarea focus-ring", value: testData.description, onChange: (e) => setTestData({ ...testData, description: e.target.value }), placeholder: "Brief description of the test...", rows: 2 })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Instructions for Students" }), _jsx("textarea", { className: "form-textarea focus-ring", value: testData.instructions, onChange: (e) => setTestData({ ...testData, instructions: e.target.value }), placeholder: "Special instructions, rules, or guidelines...", rows: 3 })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: testData.allowReview, onChange: (e) => setTestData({ ...testData, allowReview: e.target.checked }), className: "mr-2" }), "Allow question review"] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: testData.shuffleQuestions, onChange: (e) => setTestData({ ...testData, shuffleQuestions: e.target.checked }), className: "mr-2" }), "Shuffle questions"] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: testData.showResults, onChange: (e) => setTestData({ ...testData, showResults: e.target.checked }), className: "mr-2" }), "Show results after submission"] })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Test Sections" }), _jsx("button", { onClick: addSection, className: "btn btn-primary btn-sm", children: "+ Add Section" })] }), _jsx("div", { className: "flex space-x-2 mb-4 border-b border-gray-200", children: sections.map((section) => (_jsxs("button", { onClick: () => setActiveSectionId(section.id), className: `px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeSectionId === section.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'}`, children: [section.title, " (", section.questions.length, ")"] }, section.id))) }), sections.map((section) => (_jsxs("div", { className: activeSectionId === section.id ? 'block' : 'hidden', children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Section Title" }), _jsx("input", { type: "text", className: "form-input focus-ring", value: section.title, onChange: (e) => updateSection(section.id, { title: e.target.value }) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Section Description" }), _jsx("input", { type: "text", className: "form-input focus-ring", value: section.description, onChange: (e) => updateSection(section.id, { description: e.target.value }) })] })] }), _jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => setShowQuestionForm(true), className: "btn btn-primary btn-sm", children: "\u2795 Add Question" }), _jsx("button", { onClick: () => setActiveView('sample-bank'), className: "btn btn-secondary btn-sm", children: "\uD83D\uDCDA Browse Sample Questions" })] }), sections.length > 1 && (_jsx("button", { onClick: () => deleteSection(section.id), className: "btn btn-danger btn-sm", children: "\uD83D\uDDD1\uFE0F Delete Section" }))] }), _jsx("div", { className: "space-y-3", children: section.questions.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx("div", { className: "text-4xl mb-2", children: "\uD83D\uDCDD" }), _jsx("p", { children: "No questions added yet" })] })) : (section.questions.map((question, index) => (_jsx("div", { className: "border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsxs("span", { className: "font-semibold text-gray-900", children: ["Q", index + 1, "."] }), _jsx("span", { className: "badge badge-info", children: question.type }), _jsx("span", { className: `badge ${question.difficulty === 'EASY' ? 'badge-success' :
                                                                    question.difficulty === 'MEDIUM' ? 'badge-warning' : 'badge-danger'}`, children: question.difficulty }), _jsxs("span", { className: "text-sm text-gray-600", children: [question.marks, " marks"] })] }), _jsx("p", { className: "text-gray-900 mb-2", children: question.text }), question.imageUrl && (_jsx("img", { src: question.imageUrl, alt: "Question", className: "max-w-md rounded border mb-2" })), question.type === 'MCQ' && (_jsx("div", { className: "space-y-1 text-sm", children: question.options.map((option, optIndex) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: `w-6 h-6 rounded-full flex items-center justify-center text-xs ${question.correctAnswers.includes(option)
                                                                        ? 'bg-green-100 text-green-600 font-bold'
                                                                        : 'bg-gray-100 text-gray-600'}`, children: String.fromCharCode(65 + optIndex) }), _jsx("span", { className: question.correctAnswers.includes(option) ? 'text-green-600 font-medium' : 'text-gray-600', children: option })] }, optIndex))) })), question.type !== 'MCQ' && (_jsx("div", { className: "text-sm", children: _jsxs("span", { className: "text-green-600 font-medium", children: ["Correct Answer: ", question.correctAnswers[0]] }) })), question.explanation && (_jsxs("div", { className: "mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600", children: [_jsx("strong", { children: "Explanation:" }), " ", question.explanation] }))] }), _jsxs("div", { className: "flex space-x-2 ml-4", children: [_jsx("button", { onClick: () => {
                                                            setEditingQuestion(question);
                                                            setShowQuestionForm(true);
                                                        }, className: "btn btn-sm btn-secondary", children: "Edit" }), _jsx("button", { onClick: () => deleteQuestion(section.id, question.id), className: "btn btn-sm btn-danger", children: "Delete" })] })] }) }, question.id)))) })] }, section.id)))] }), _jsx("div", { className: "flex justify-center", children: _jsx("button", { onClick: handleTestSubmit, disabled: loading || sections.every(s => s.questions.length === 0), className: "btn btn-primary btn-lg btn-animated", children: loading ? 'Creating Test...' : 'Create Test' }) })] }));
    return (_jsxs("div", { className: "fade-in", children: [_jsx("div", { className: "mb-6", children: _jsx("div", { className: "flex space-x-4 border-b border-gray-200", children: [
                        { key: 'creator', label: 'Test Creator', icon: '✏️' },
                        { key: 'sample-bank', label: 'Question Bank', icon: '📚' },
                        ...(sections.some(s => s.questions.length > 0) ? [{ key: 'preview', label: 'Preview', icon: '👁️' }] : [])
                    ].map(tab => (_jsxs("button", { onClick: () => setActiveView(tab.key), className: `px-4 py-2 font-medium text-sm border-b-2 transition-colors hover-scale ${activeView === tab.key
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'}`, children: [_jsx("span", { className: "mr-2", children: tab.icon }), tab.label] }, tab.key))) }) }), activeView === 'creator' && renderTestCreator(), activeView === 'sample-bank' && renderSampleQuestionsBank(), activeView === 'preview' && (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDD04" }), _jsx("p", { children: "Preview functionality coming soon!" })] })), showQuestionForm && renderQuestionForm()] }));
};
export default TestCreatorEnhanced;
