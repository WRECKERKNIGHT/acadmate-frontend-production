import React, { useState } from 'react'

interface Question {
  id: string
  type: 'MCQ' | 'SHORT_ANSWER' | 'INTEGER'
  text: string
  options: string[]
  correctAnswers: string[]
  marks: number
  negativeMarks: number
}

interface Section {
  id: string
  title: string
  order: number
  questions: Question[]
}

const TestCreator: React.FC = () => {
  const [testTitle, setTestTitle] = useState('')
  const [sections, setSections] = useState<Section[]>([{
    id: '1',
    title: 'Section 1',
    order: 1,
    questions: []
  }])

  const addSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: `Section ${sections.length + 1}`,
      order: sections.length + 1,
      questions: []
    }
    setSections([...sections, newSection])
  }

  const updateSectionTitle = (sectionId: string, title: string) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, title } : section
    ))
  }

  const addQuestion = (sectionId: string) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'MCQ',
      text: '',
      options: ['', '', '', ''],
      correctAnswers: [],
      marks: 1,
      negativeMarks: 0
    }
    
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, questions: [...section.questions, newQuestion] }
        : section
    ))
  }

  const updateQuestion = (sectionId: string, questionId: string, updatedQuestion: Partial<Question>) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            questions: section.questions.map(q => 
              q.id === questionId ? { ...q, ...updatedQuestion } : q
            )
          }
        : section
    ))
  }

  const deleteQuestion = (sectionId: string, questionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, questions: section.questions.filter(q => q.id !== questionId) }
        : section
    ))
  }

  const updateOption = (sectionId: string, questionId: string, optionIndex: number, value: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            questions: section.questions.map(q => 
              q.id === questionId 
                ? { 
                    ...q, 
                    options: q.options.map((opt, idx) => idx === optionIndex ? value : opt)
                  }
                : q
            )
          }
        : section
    ))
  }

  const renderQuestion = (section: Section, question: Question) => (
    <div key={question.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ flex: 1, marginRight: '1rem' }}>
          <select
            value={question.type}
            onChange={(e) => updateQuestion(section.id, question.id, { type: e.target.value as Question['type'] })}
            style={{ padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #ccc', borderRadius: 4 }}
          >
            <option value="MCQ">Multiple Choice</option>
            <option value="SHORT_ANSWER">Short Answer</option>
            <option value="INTEGER">Integer Answer</option>
          </select>
          
          <textarea
            placeholder="Enter your question here..."
            value={question.text}
            onChange={(e) => updateQuestion(section.id, question.id, { text: e.target.value })}
            style={{ width: '100%', minHeight: '80px', padding: '0.5rem', border: '1px solid #ccc', borderRadius: 4, resize: 'vertical' }}
          />
        </div>
        
        <button 
          onClick={() => deleteQuestion(section.id, question.id)}
          style={{ padding: '0.5rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          Delete
        </button>
      </div>

      {question.type === 'MCQ' && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Options:</p>
          {question.options.map((option, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input
                type="checkbox"
                checked={question.correctAnswers.includes(index.toString())}
                onChange={(e) => {
                  const correctAnswers = e.target.checked 
                    ? [...question.correctAnswers, index.toString()]
                    : question.correctAnswers.filter(ans => ans !== index.toString())
                  updateQuestion(section.id, question.id, { correctAnswers })
                }}
                style={{ marginRight: '0.5rem' }}
              />
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => updateOption(section.id, question.id, index, e.target.value)}
                style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: 4 }}
              />
            </div>
          ))}
          <small style={{ color: '#666' }}>Check the boxes next to correct answers</small>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Marks:</span>
          <input
            type="number"
            min="1"
            value={question.marks}
            onChange={(e) => updateQuestion(section.id, question.id, { marks: parseInt(e.target.value) || 1 })}
            style={{ width: '60px', padding: '0.25rem', border: '1px solid #ccc', borderRadius: 4 }}
          />
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Negative Marks:</span>
          <input
            type="number"
            min="0"
            step="0.25"
            value={question.negativeMarks}
            onChange={(e) => updateQuestion(section.id, question.id, { negativeMarks: parseFloat(e.target.value) || 0 })}
            style={{ width: '60px', padding: '0.25rem', border: '1px solid #ccc', borderRadius: 4 }}
          />
        </label>
      </div>
    </div>
  )

  const handleSaveTest = () => {
    if (!testTitle.trim()) {
      alert('Please enter a test title')
      return
    }
    
    // TODO: Save test to backend
    console.log('Saving test:', { title: testTitle, sections })
    alert('Test saved successfully! (Backend integration pending)')
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: 8 }}>
        <h2>Create New Test</h2>
        <input
          type="text"
          placeholder="Enter test title..."
          value={testTitle}
          onChange={(e) => setTestTitle(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', fontSize: '1.1rem', border: '1px solid #ccc', borderRadius: 4, marginBottom: '1rem' }}
        />
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleSaveTest}
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
          >
            Save Test
          </button>
          
          <button 
            onClick={addSection}
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
          >
            Add Section
          </button>
        </div>
      </div>

      {sections.map(section => (
        <div key={section.id} style={{ marginBottom: '2rem', padding: '1.5rem', border: '2px solid #007bff', borderRadius: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <input
              type="text"
              value={section.title}
              onChange={(e) => updateSectionTitle(section.id, e.target.value)}
              style={{ fontSize: '1.2rem', fontWeight: 'bold', padding: '0.5rem', border: '1px solid #ccc', borderRadius: 4 }}
            />
            
            <button 
              onClick={() => addQuestion(section.id)}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
            >
              Add Question
            </button>
          </div>
          
          {section.questions.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
              No questions in this section yet. Click "Add Question" to get started.
            </p>
          ) : (
            section.questions.map(question => renderQuestion(section, question))
          )}
        </div>
      ))}
    </div>
  )
}

export default TestCreator