import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

export default function PermaLanding() {
  const { flash, auth } = usePage().props;
  const user = auth?.user;

  return (
    <>
      <Head title="Workplace PERMA Profiler" />

      {/* Main container with animated background */}
      <div className="relative min-h-screen bg-white text-gray-900 overflow-hidden">
        {/* Animated background element (very subtle) */}
        <div className="absolute inset-0 z-0 animate-gradient opacity-10"></div>

        {/* Content - solid backgrounds, above the animation */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
          
          {/* Login / User status bar */}
          <div className="flex justify-end mb-4">
            {user ? (
              user.role === 'hr' ? (
                <Link
                  href="/perma-reports"
                  className="text-sm text-green-600 hover:text-green-800 border border-green-300 px-3 py-1 rounded"
                >
                  View Reports →
                </Link>
              ) : (
                <span className="text-sm text-gray-500">
                  Logged in as {user.name}
                </span>
              )
            ) : (
              <Link
                href="/hr/login"
                className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1 rounded"
              >
                HR Login
              </Link>
            )}
          </div>

          {/* Flash message */}
          {flash?.success && (
            <div className="mb-4 sm:mb-6 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded flex items-center gap-2 text-sm sm:text-base">
              <span>✨</span>
              <span className="flex-1">{flash.success}</span>
            </div>
          )}

          {/* Hero – honest and inviting */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block bg-gray-200 px-3 py-1 rounded text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4">
              ⚡ Your voice matters
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
              Share your experience<br />to help make work better.
            </h1>
            <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto mb-4 sm:mb-6">
              Answer 23 quick questions about your work life. Your honest input helps us understand 
              what really matters at work.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {/* Buttons can be added here if needed */}
            </div>
          </div>

         

          {/* Why it matters – focus on contribution
          <div className="text-center mb-12 sm:mb-16" id="learn-more">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Every response helps<br />
              <span className="text-green-700">build a clearer picture.</span>
            </h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-700 max-w-md mx-auto">
              <li>✦ Contribute to real research on workplace wellbeing</li>
              <li>✦ No account, no email – just your honest input</li>
              <li>✦ Help shape a better work environment for everyone</li>
            </ul>
          </div> */}

          {/* Inspiring image */}
          <div className="mb-8 flex justify-center">
            <img
              src="/images/landingpage.png"
              alt="A diverse team collaborating happily, encouraging survey participation"
              className="rounded-xl  max-w-full h-auto max-h-90 object-cover"
            />
          </div>

          {/* Final CTA – reframed */}
          <div className="bg-gray-100 border border-gray-300 rounded p-6 sm:p-8 text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Ready to share your perspective?</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">It’s free, private, and only takes 5 minutes.</p>
            <Link
              href="/survey/perma/form"
              className="inline-block w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded text-sm sm:text-base"
            >
              Start the survey
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center text-xs sm:text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Workplace PERMA Profiler — based on Martin Seligman’s PERMA model.</p>
            <p className="mt-2 space-x-2">
              <a href="#" className="text-gray-700 hover:text-gray-900 underline">Privacy</a>
              <span>·</span>
              <a href="#" className="text-gray-700 hover:text-gray-900 underline">Terms</a>
              <span>·</span>
              <a href="https://positivepsychology.com/perma-model/" target="_blank" rel="noopener" className="text-gray-700 hover:text-gray-900 underline">About PERMA</a>
            </p>
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 0%; }
          25% { background-position: 100% 0%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
          100% { background-position: 0% 0%; }
        }
        .animate-gradient {
          background: linear-gradient(45deg,rgb(243, 76, 76),rgb(75, 42, 207),rgb(237, 249, 16),rgb(30, 29, 29));
          background-size: 300% 300%;
          animation: gradientShift 15s ease infinite;
        }
      `}</style>
    </>
  );
}