// resources/js/Pages/PermaSurvey/PermaForm.jsx
import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { permaQuestions as enQuestions } from './permaQuestions';
import { permaQuestions as bisayaQuestions } from './permaQuestionsBisaya';

const sections = [
  { title: 'Positive Emotion', questions: [1, 6, 11] },
  { title: 'Engagement', questions: [2, 7, 12] },
  { title: 'Relationships', questions: [3, 8, 13] },
  { title: 'Meaning', questions: [4, 9, 14] },
  { title: 'Accomplishment', questions: [5, 10, 15] },
  { title: 'Health & Overall Wellbeing', questions: [16, 17, 18, 19, 20, 21, 22, 23] },
];

export default function PermaForm({ departments }) {
  const [language, setLanguage] = useState('en');
  const questions = language === 'en' ? enQuestions : bisayaQuestions;

  const { data, setData, post, processing, errors } = useForm({
    respondent_name: '',
    department_id: '',
    age_bracket: '',
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '', q9: '', q10: '',
    q11: '', q12: '', q13: '', q14: '', q15: '', q16: '', q17: '', q18: '', q19: '', q20: '',
    q21: '', q22: '', q23: '',
  });

  const totalQuestions = 23;
  const answeredCount = Object.keys(data).filter(key => key.startsWith('q') && data[key] !== '').length;

  // Check if all required fields are filled
  const isFormValid = () => {
    return data.department_id && data.age_bracket && answeredCount === totalQuestions;
  };

  const toggleLanguage = () => setLanguage(prev => (prev === 'en' ? 'bisaya' : 'en'));

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/survey/perma');
  };

  const ageBrackets = ['20-29', '30-39', '40-49', '50-59', '60+'];
  const progress = (answeredCount / totalQuestions) * 100;

  return (
    <>
      <Head title="PERMA Survey" />
      <div className="max-w-4xl mx-auto py-6 px-4 sm:py-8">
        {/* Header with language toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
            {language === 'en' ? 'Workplace PERMA Profiler' : 'PERMA Survey sa Trabaho'}
          </h1>
          <button
            onClick={toggleLanguage}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg text-sm transition w-full sm:w-auto"
          >
            {language === 'en' ? 'Bisaya' : 'English'}
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-center text-gray-600 mb-8 text-sm sm:text-base">
          {language === 'en'
            ? 'Please rate each item by selecting the appropriate number.'
            : 'Palihog tubaga ang matag pangutana pinaagi sa pagpili sa numero.'}
          <br />
          <span className="text-xs">
            {/* {language === 'en' ? 'All responses are confidential.' : 'Ang tanan nga tubag pribado.'} */}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Optional respondent info – name optional, department and age required */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
              {language === 'en' ? 'About you' : 'Mahitungod kanimo'}
            </h2>
            <div className="space-y-4">
              {/* Name – optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Your name (optional)' : 'Imong ngalan (opsyonal)'}
                </label>
                <input
                  type="text"
                  value={data.respondent_name}
                  onChange={e => setData('respondent_name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder={language === 'en' ? 'e.g., Juan Dela Cruz' : 'Pananglitan, Juan Dela Cruz'}
                />
              </div>

              {/* Department – required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Department' : 'Departamento'} <span className="text-red-500">*</span>
                </label>
                <select
                  value={data.department_id}
                  onChange={e => setData('department_id', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">
                    {language === 'en' ? '-- Select department --' : '-- Pagpili og departamento --'}
                  </option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
                {errors.department_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.department_id}</p>
                )}
              </div>

              {/* Age bracket – required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Age bracket' : 'Edad'} <span className="text-red-500">*</span>
                </label>
                <select
                  value={data.age_bracket}
                  onChange={e => setData('age_bracket', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">
                    {language === 'en' ? '-- Select age bracket --' : '-- Pagpili og edad --'}
                  </option>
                  {ageBrackets.map(bracket => (
                    <option key={bracket} value={bracket}>{bracket}</option>
                  ))}
                </select>
                {errors.age_bracket && (
                  <p className="text-red-500 text-sm mt-1">{errors.age_bracket}</p>
                )}
              </div>
            </div>
          </div>

          {/* Survey sections */}
          {sections.map((section) => (
            <div key={section.title} className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                {section.title}
              </h2>
              <div className="space-y-6">
                {section.questions.map((qId) => {
                  const q = questions.find(q => q.id === qId);
                  if (!q) return null;
                  return (
                    <div key={q.id} className="border-t pt-4 first:border-t-0 first:pt-0">
                      <p className="font-medium text-base sm:text-lg mb-4 leading-tight">
                        {q.id}. {q.text}
                      </p>
                      <div className="grid grid-cols-5 gap-2 sm:gap-3">
                        {q.labels.map((label, idx) => {
                          const value = idx + 1;
                          return (
                            <label
                              key={idx}
                              className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
                            >
                              <input
                                type="radio"
                                name={`q${q.id}`}
                                value={value}
                                checked={data[`q${q.id}`] == value}
                                onChange={(e) => setData(`q${q.id}`, e.target.value)}
                                className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 accent-blue-600 mb-1.5"
                              />
                              <span className="text-[10px] sm:text-xs text-gray-600 text-center leading-tight">
                                {label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                      {errors[`q${q.id}`] && (
                        <p className="text-red-500 text-sm mt-2 text-center">{errors[`q${q.id}`]}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Sticky submit button */}
          <div className="sticky bottom-4 bg-white p-4 rounded-xl shadow-lg border">
            <button
              type="submit"
              disabled={processing || !isFormValid()}
              className="w-full sm:w-auto sm:min-w-[200px] mx-auto block bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3.5 px-8 rounded-xl text-base disabled:opacity-50 transition-all"
            >
              {processing
                ? (language === 'en' ? 'Submitting...' : 'Gipadala...')
                : (language === 'en' ? 'Submit Survey' : 'Ipadala ang Survey')}
            </button>
            {!isFormValid() && (
              <p className="text-sm text-gray-500 text-center mt-2">
                {language === 'en'
                  ? `Please select department, age bracket, and answer all ${totalQuestions} questions.`
                  : `Palihog pagpili og departamento, edad, ug tubaga ang tanang ${totalQuestions} ka pangutana.`}
              </p>
            )}
          </div>
        </form>
      </div>
    </>
  );
}