// resources/js/Pages/Survey/PermaForm.jsx

import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import { permaQuestions } from '../PermaSurvey/permaQuestions';

export default function PermaForm() {
  const { data, setData, post, processing, errors } = useForm({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '', q9: '', q10: '',
    q11: '', q12: '', q13: '', q14: '', q15: '', q16: '', q17: '', q18: '', q19: '', q20: '',
    q21: '', q22: '', q23: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/survey/perma');
  };

  return (
    <>
      <Head title="PERMA Survey" />
      <div className="max-w-4xl mx-auto py-6 px-4 sm:py-8"> {/* smaller top/bottom padding on mobile */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">Workplace PERMA Profiler</h1>
        <p className="text-center text-gray-600 mb-8 text-sm sm:text-base">
          Please rate each item by selecting the appropriate number.<br />
          <span className="text-xs">All responses are confidential.</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {permaQuestions.map((q) => (
            <div key={q.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
              <p className="font-medium text-base sm:text-lg mb-4 leading-tight">
                {q.id}. {q.text}
              </p>

              {/* Mobile-optimized 5-point scale */}
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {q.labels.map((label, idx) => {
                  const value = idx + 1;
                  return (
                    <label
                      key={idx}
                      className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform" /* better touch feedback */
                    >
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        value={value}
                        checked={data[`q${q.id}`] == value}
                        onChange={(e) => setData(`q${q.id}`, e.target.value)}
                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 accent-blue-600 mb-1.5" /* larger touch target on mobile */
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
          ))}

          {/* Full-width submit button on mobile, centered & auto-width on larger screens */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={processing}
              className="w-full sm:w-auto sm:min-w-[200px] mx-auto block bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3.5 px-8 rounded-xl text-base disabled:opacity-50 transition-all"
            >
              {processing ? 'Submitting...' : 'Submit Survey'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}