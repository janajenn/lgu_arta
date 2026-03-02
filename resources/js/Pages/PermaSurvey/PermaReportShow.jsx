import React, { useState } from 'react';
import PermaReportsLayout from '../../Shared/Layouts/PermaReportsLayout';
import { Head, Link } from '@inertiajs/react';
import {
  HeartIcon,
  SparklesIcon,
  UserGroupIcon,
  AcademicCapIcon,
  TrophyIcon,
  BeakerIcon,
  FaceFrownIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { permaQuestions } from '../PermaSurvey/permaQuestions'; // adjust path as needed

export default function PermaReportShow({ response }) {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const getColorClass = (color, type = 'bg') => {
    const map = {
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        badge: 'bg-green-100 text-green-800',
      },
      emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-800',
        badge: 'bg-emerald-100 text-emerald-800',
      },
      yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
        badge: 'bg-yellow-100 text-yellow-800',
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-800',
        badge: 'bg-orange-100 text-orange-800',
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        badge: 'bg-red-100 text-red-800',
      },
    };
    return map[color]?.[type] || map.green[type];
  };

  const domainIcons = {
    positive_emotion: SparklesIcon,
    engagement: BeakerIcon,
    relationships: UserGroupIcon,
    meaning: AcademicCapIcon,
    accomplishment: TrophyIcon,
  };

  const domainNames = {
    positive_emotion: 'Positive Emotion',
    engagement: 'Engagement',
    relationships: 'Relationships',
    meaning: 'Meaning',
    accomplishment: 'Accomplishment',
  };

  const getDomainStatement = (domain, label) => {
    const statements = {
      positive_emotion: {
        'Very High': 'Flourishing emotional wellbeing at work.',
        'High': 'Generally feels good at work.',
        'Moderate': 'Occasional positive feelings; room to grow.',
        'Low': 'May experience frequent stress or negativity.',
        'Very Low': 'Rarely feels positive; potential burnout.',
      },
      engagement: {
        'Very High': 'Deeply involved and enthusiastic.',
        'High': 'Enjoys work, often in a state of flow.',
        'Moderate': 'Sometimes engaged; may lack full interest.',
        'Low': 'May feel bored, disconnected, or underutilized.',
        'Very Low': 'Work feels monotonous or meaningless.',
      },
      relationships: {
        'Very High': 'Strong support and positive interactions.',
        'High': 'Good social connections at work.',
        'Moderate': 'Some positive ties, but inconsistencies.',
        'Low': 'Possible isolation or poor communication.',
        'Very Low': 'Feels unsupported or disconnected.',
      },
      meaning: {
        'Very High': 'Work feels deeply important.',
        'High': 'Often finds purpose and value in work.',
        'Moderate': 'Work has some purpose but lacks strong alignment.',
        'Low': 'Feels disconnected from the “why” of their job.',
        'Very Low': 'Work feels meaningless or misaligned with values.',
      },
      accomplishment: {
        'Very High': 'Feels successful and goal-driven.',
        'High': 'Often meets goals and feels capable.',
        'Moderate': 'Some success, but could feel unfulfilled.',
        'Low': 'May feel stagnant or underrecognized.',
        'Very Low': 'Frequent feelings of failure or lack of progress.',
      },
    };
    return statements[domain]?.[label] || '';
  };

  const getOverallStatement = (label) => {
    const statements = {
      'Very High': 'Indicates excellent levels of flourishing. The individual often experiences positive outcomes in all areas.',
      'High': 'Reflects strong overall wellbeing. The individual regularly experiences positive outcomes, though there may still be room for growth.',
      'Moderate': 'Suggests average functioning. The individual sometimes experiences wellbeing but may also face some challenges.',
      'Low': 'Indicates below-average overall wellbeing. The individual may often feel dissatisfied or disengaged.',
      'Very Low': 'Reflects significant concern. The individual rarely experiences wellbeing and may be at risk for burnout or disengagement.',
    };
    return statements[label] || '';
  };

  const additionalMetrics = [
    { label: 'Health', value: response.health, icon: HeartIcon, color: 'green' },
    { label: 'Negative Emotion', value: response.negative_emotion, icon: FaceFrownIcon, color: 'orange' },
    { label: 'Loneliness', value: response.loneliness, icon: UserIcon, color: 'red' },
  ];

  // Helper to get question label for a score
  const getScoreLabel = (questionId, score) => {
    const q = permaQuestions.find(q => q.id === questionId);
    return q?.labels[score - 1] || '';
  };

  return (
    <PermaReportsLayout>
      <Head title={`PERMA Report - ${response.user?.name || 'Anonymous'}`} />
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Modal */}
        {selectedQuestion && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedQuestion(null)}></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Question {selectedQuestion.id}
                    </h3>
                    <button onClick={() => setSelectedQuestion(null)} className="text-gray-400 hover:text-gray-500">
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-4">{selectedQuestion.text}</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Answer:</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedQuestion.score} – {selectedQuestion.label}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => setSelectedQuestion(null)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header with back button */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">PERMA Response Details</h1>
          <Link
            href={route('perma.reports')}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            ← Back to Reports
          </Link>
        </div>

        {/* User info and overall card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-medium text-lg">
                  {response.user ? response.user.name.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {response.user ? response.user.name : 'Anonymous Respondent'}
                </h2>
                {response.user?.department && (
                  <p className="text-sm text-gray-500">{response.user.department.name}</p>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Submitted: {new Date(response.created_at).toLocaleString()}
            </div>
          </div>

          {/* Overall PERMA card */}
          <div className="p-6">
            <div className={`rounded-xl p-6 border-2 ${getColorClass(response.overall_perma.color, 'border')} ${getColorClass(response.overall_perma.color, 'bg')}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Overall PERMA Wellbeing</h3>
                  <p className="text-sm text-gray-600 max-w-2xl">{getOverallStatement(response.overall_perma.label)}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${getColorClass(response.overall_perma.color, 'badge')}`}>
                    {response.overall_perma.label}
                  </span>
                  <span className="text-3xl font-bold text-gray-900">{response.overall_perma.score}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Domain cards */}
        <h3 className="text-lg font-medium text-gray-900 mb-4">PERMA Domains</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {Object.entries(domainNames).map(([key, name]) => {
            const score = response.perma_scores[key];
            if (!score) return null;
            const Icon = domainIcons[key];
            return (
              <div
                key={key}
                className={`bg-white rounded-xl shadow-sm border-l-4 ${getColorClass(score.color, 'border')} overflow-hidden hover:shadow-md transition-shadow`}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {Icon && <Icon className={`h-5 w-5 ${getColorClass(score.color, 'text')}`} />}
                      <h4 className="font-medium text-gray-900">{name}</h4>
                    </div>
                    <span className={`text-lg font-bold ${getColorClass(score.color, 'text')}`}>{score.score}</span>
                  </div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${getColorClass(score.color, 'text')}`}>
                    {score.label}
                  </p>
                  <p className="text-sm text-gray-600">{getDomainStatement(key, score.label)}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional metrics */}
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Wellbeing Indicators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {additionalMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center space-x-3 mb-2">
                  <Icon className={`h-5 w-5 text-${metric.color}-500`} />
                  <span className="font-medium text-gray-700">{metric.label}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{metric.value ?? 'N/A'}</div>
              </div>
            );
          })}
        </div>

        {/* Individual question responses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Individual Question Responses</h3>
            <p className="text-sm text-gray-500">Each question was rated from 1 (lowest) to 5 (highest). Click any card to see the question.</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {Array.from({ length: 23 }, (_, i) => i + 1).map((q) => {
                const score = response[`q${q}`];
                const label = getScoreLabel(q, score);
                return (
                  <button
                    key={q}
                    onClick={() => setSelectedQuestion({
                      id: q,
                      text: permaQuestions.find(qq => qq.id === q)?.text || '',
                      score,
                      label,
                    })}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:bg-gray-100 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors w-full"
                  >
                    <div className="text-xs text-gray-500 mb-1">Q{q}</div>
                    <div className="text-lg font-semibold text-gray-800">{score}</div>
                    <div className="text-xs text-gray-500 mt-1 truncate">{label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PermaReportsLayout>
  );
}