import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const TestCreator = () => {
    const [testTitle, setTestTitle] = useState('');
    const [sections, setSections] = useState([{
            id: '1',
            title: 'Section 1',
            order: 1,
            questions: []
        }]);
    const addSection = () => {
        const newSection = {
            id: Date.now().toString(),
            title: `Section ${sections.length + 1}`,
            order: sections.length + 1,
            questions: []
        };
        setSections([...sections, newSection]);
    };
    const updateSectionTitle = (sectionId, title) => {
        setSections(sections.map(section => section.id === sectionId ? { ...section, title } : section));
    };
    const addQuestion = (sectionId) => {
        const newQuestion = {
            id: Date.now().toString(),
            type: 'MCQ',
            text: '',
            options: ['', '', '', ''],
            correctAnswers: [],
            marks: 1,
            negativeMarks: 0
        };
        setSections(sections.map(section => section.id === sectionId
            ? { ...section, questions: [...section.questions, newQuestion] }
            : section));
    };
    const updateQuestion = (sectionId, questionId, updatedQuestion) => {
        setSections(sections.map(section => section.id === sectionId
            ? {
                ...section,
                questions: section.questions.map(q => q.id === questionId ? { ...q, ...updatedQuestion } : q)
            }
            : section));
    };
    const deleteQuestion = (sectionId, questionId) => {
        setSections(sections.map(section => section.id === sectionId
            ? { ...section, questions: section.questions.filter(q => q.id !== questionId) }
            : section));
    };
    const updateOption = (sectionId, questionId, optionIndex, value) => {
        setSections(sections.map(section => section.id === sectionId
            ? {
                ...section,
                questions: section.questions.map(q => q.id === questionId
                    ? {
                        ...q,
                        options: q.options.map((opt, idx) => idx === optionIndex ? value : opt)
                    }
                    : q)
            }
            : section));
    };
    const renderQuestion = (section, question) => (_jsxs("div", { style: { border: '1px solid #ddd', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }, children: [_jsxs("div", { style: { flex: 1, marginRight: '1rem' }, children: [_jsxs("select", { value: question.type, onChange: (e) => updateQuestion(section.id, question.id, { type: e.target.value }), style: { padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #ccc', borderRadius: 4 }, children: [_jsx("option", { value: "MCQ", children: "Multiple Choice" }), _jsx("option", { value: "SHORT_ANSWER", children: "Short Answer" }), _jsx("option", { value: "INTEGER", children: "Integer Answer" })] }), _jsx("textarea", { placeholder: "Enter your question here...", value: question.text, onChange: (e) => updateQuestion(section.id, question.id, { text: e.target.value }), style: { width: '100%', minHeight: '80px', padding: '0.5rem', border: '1px solid #ccc', borderRadius: 4, resize: 'vertical' } })] }), _jsx("button", { onClick: () => deleteQuestion(section.id, question.id), style: { padding: '0.5rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }, children: "Delete" })] }), question.type === 'MCQ' && (_jsxs("div", { style: { marginBottom: '1rem' }, children: [_jsx("p", { style: { marginBottom: '0.5rem', fontWeight: 'bold' }, children: "Options:" }), question.options.map((option, index) => (_jsxs("div", { style: { display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }, children: [_jsx("input", { type: "checkbox", checked: question.correctAnswers.includes(index.toString()), onChange: (e) => {
                                    const correctAnswers = e.target.checked
                                        ? [...question.correctAnswers, index.toString()]
                                        : question.correctAnswers.filter(ans => ans !== index.toString());
                                    updateQuestion(section.id, question.id, { correctAnswers });
                                }, style: { marginRight: '0.5rem' } }), _jsx("input", { type: "text", placeholder: `Option ${index + 1}`, value: option, onChange: (e) => updateOption(section.id, question.id, index, e.target.value), style: { flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: 4 } })] }, index))), _jsx("small", { style: { color: '#666' }, children: "Check the boxes next to correct answers" })] })), _jsxs("div", { style: { display: 'flex', gap: '1rem', alignItems: 'center' }, children: [_jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx("span", { children: "Marks:" }), _jsx("input", { type: "number", min: "1", value: question.marks, onChange: (e) => updateQuestion(section.id, question.id, { marks: parseInt(e.target.value) || 1 }), style: { width: '60px', padding: '0.25rem', border: '1px solid #ccc', borderRadius: 4 } })] }), _jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }, children: [_jsx("span", { children: "Negative Marks:" }), _jsx("input", { type: "number", min: "0", step: "0.25", value: question.negativeMarks, onChange: (e) => updateQuestion(section.id, question.id, { negativeMarks: parseFloat(e.target.value) || 0 }), style: { width: '60px', padding: '0.25rem', border: '1px solid #ccc', borderRadius: 4 } })] })] })] }, question.id));
    const handleSaveTest = () => {
        if (!testTitle.trim()) {
            alert('Please enter a test title');
            return;
        }
        // TODO: Save test to backend
        console.log('Saving test:', { title: testTitle, sections });
        alert('Test saved successfully! (Backend integration pending)');
    };
    return (_jsxs("div", { style: { maxWidth: '800px', margin: '0 auto' }, children: [_jsxs("div", { style: { marginBottom: '2rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: 8 }, children: [_jsx("h2", { children: "Create New Test" }), _jsx("input", { type: "text", placeholder: "Enter test title...", value: testTitle, onChange: (e) => setTestTitle(e.target.value), style: { width: '100%', padding: '0.75rem', fontSize: '1.1rem', border: '1px solid #ccc', borderRadius: 4, marginBottom: '1rem' } }), _jsxs("div", { style: { display: 'flex', gap: '1rem' }, children: [_jsx("button", { onClick: handleSaveTest, style: { padding: '0.75rem 1.5rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }, children: "Save Test" }), _jsx("button", { onClick: addSection, style: { padding: '0.75rem 1.5rem', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }, children: "Add Section" })] })] }), sections.map(section => (_jsxs("div", { style: { marginBottom: '2rem', padding: '1.5rem', border: '2px solid #007bff', borderRadius: 8 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }, children: [_jsx("input", { type: "text", value: section.title, onChange: (e) => updateSectionTitle(section.id, e.target.value), style: { fontSize: '1.2rem', fontWeight: 'bold', padding: '0.5rem', border: '1px solid #ccc', borderRadius: 4 } }), _jsx("button", { onClick: () => addQuestion(section.id), style: { padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }, children: "Add Question" })] }), section.questions.length === 0 ? (_jsx("p", { style: { color: '#666', textAlign: 'center', padding: '2rem' }, children: "No questions in this section yet. Click \"Add Question\" to get started." })) : (section.questions.map(question => renderQuestion(section, question)))] }, section.id)))] }));
};
export default TestCreator;
