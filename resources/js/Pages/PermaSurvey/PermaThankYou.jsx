import React, { useEffect, useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function PermaThankYou() {
  const { totalResponses, monthlyResponses, flash } = usePage().props;
  const confettiRef = useRef(null);

  useEffect(() => {
    // Simple confetti animation (runs once on mount)
    const canvas = confettiRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#f43f5e', '#8b5cf6', '#0ea5e9', '#f59e0b', '#10b981'];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 6 + 2,
        speed: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
      });
    }

    let animationFrame;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.speed * 0.5;
        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <>
      <Head title="Thank You!" />

      {/* Optional flash messages */}
      {flash?.info && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded shadow-lg">
          {flash.info}
        </div>
      )}
      {flash?.error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
          {flash.error}
        </div>
      )}

      {/* Confetti canvas, background, particles (keep as before) */}
      <canvas ref={confettiRef} className="fixed inset-0 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 animate-gradient-xy z-0" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-300 rounded-full animate-float opacity-50"></div>
        <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-emerald-300 rounded-full animate-float animation-delay-1000 opacity-50"></div>
        <div className="absolute bottom-1/4 left-2/3 w-4 h-4 bg-teal-300 rounded-full animate-float animation-delay-2000 opacity-40"></div>
      </div>

      {/* Main content */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-8 z-10">
        <div className="max-w-lg w-full">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-12 border border-white/50 animate-scale-in">
            <div className="text-center">
              {/* Animated checkmark */}
              <div className="relative inline-flex mb-6">
                <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30"></div>
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl animate-bounce-in">
                  <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>

              <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-3 animate-slide-up">
                Thank You!
              </h1>
              <p className="text-xl text-gray-600 mb-4 animate-slide-up animation-delay-100">
                You're awesome! 🙌
              </p>
              <p className="text-gray-500 max-w-sm mx-auto mb-8 animate-slide-up animation-delay-200">
                Your voice matters. Thanks for helping us understand workplace wellbeing better.
              </p>

              <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-green-300"></div>
                <span className="text-2xl animate-sparkle">✨</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-green-300"></div>
              </div>

              {/* Impact message with real data */}
              <div className="bg-green-50 rounded-xl p-4 mb-8 border border-green-100 animate-fade-in">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-green-700">
                    You're one of {monthlyResponses?.toLocaleString() ?? totalResponses?.toLocaleString() ?? '1,234'}
                  </span>{' '}
                  people who've shared their perspective this month. Together we're making work better.
                </p>
              </div>

              <Link
                href="/survey/perma"
                className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-gray font-bold px-10 py-5 rounded-full text-lg shadow-xl shadow-green-600/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-slide-up animation-delay-300"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                Return to Home
                <span className="text-xl group-hover:rotate-12 transition-transform">🏠</span>
              </Link>
            </div>
          </div>
          <p className="text-center text-gray-400 text-xs mt-8 animate-fade-in">
            Your responses are anonymous and confidential.
          </p>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 0%; }
          25% { background-position: 100% 0%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
        }
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 15s ease infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes scale-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        @keyframes slide-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }

        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.1); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }

        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        @keyframes sparkle {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }

        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </>
  );
}