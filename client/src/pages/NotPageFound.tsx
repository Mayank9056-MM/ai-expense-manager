import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NoPageFound = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="text-[150px] sm:text-[200px] lg:text-[250px] font-black leading-none bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent animate-pulse-slow">
            404
          </div>
          
          {/* Floating icons around 404 */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 animate-float">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center shadow-lg">
                <Search className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute top-1/4 right-1/4 animate-float animation-delay-1000">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-400 to-pink-400 flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">?</span>
              </div>
            </div>
            <div className="absolute bottom-1/3 left-1/3 animate-float animation-delay-2000">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-violet-400 flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 lg:p-12 mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mb-2">
            The page you're looking for seems to have wandered off...
          </p>
          <p className="text-slate-500 text-sm sm:text-base mb-8">
            It might have been moved, deleted, or never existed in the first place.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleGoHome}
              className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="w-full sm:w-auto h-12 px-8 border-2 border-violet-300 hover:border-violet-400 hover:bg-violet-50 text-violet-700 font-semibold rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>
        </div>

        {/* Help Text */}
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/20 p-4 sm:p-6">
          <p className="text-slate-600 text-sm sm:text-base mb-3">
            <span className="font-semibold">Need help?</span> Here are some useful links:
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <a 
              href="/dashboard" 
              className="text-violet-600 hover:text-fuchsia-600 font-medium text-sm sm:text-base transition-colors underline decoration-2 underline-offset-4"
            >
              Dashboard
            </a>
            <span className="text-slate-300">•</span>
            <a 
              href="/expenses" 
              className="text-violet-600 hover:text-fuchsia-600 font-medium text-sm sm:text-base transition-colors underline decoration-2 underline-offset-4"
            >
              Expenses
            </a>
            <span className="text-slate-300">•</span>
            <a 
              href="/support" 
              className="text-violet-600 hover:text-fuchsia-600 font-medium text-sm sm:text-base transition-colors underline decoration-2 underline-offset-4"
            >
              Support
            </a>
          </div>
        </div>

        {/* Fun emoji decoration */}
        <div className="mt-8 text-6xl sm:text-7xl opacity-50">
          🔍💸
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default NoPageFound;