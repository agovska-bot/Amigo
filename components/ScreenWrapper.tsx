
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../types';

interface ScreenWrapperProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  footerContent?: React.ReactNode;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, title, showBackButton = true, footerContent }) => {
  const { setCurrentScreen } = useAppContext();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full p-4 sm:p-6 relative overflow-x-hidden">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-teal-900/10 flex flex-col min-h-[90vh] sm:min-h-[85vh] relative z-10 overflow-hidden border border-white">
        <main className="flex-grow flex flex-col min-h-0">
          {title && (
            <header className="relative flex items-center justify-center p-6 sm:p-8 pb-0">
              {showBackButton && (
                <button
                  onClick={() => setCurrentScreen(Screen.Home)}
                  className="absolute left-6 sm:left-8 w-10 h-10 flex items-center justify-center bg-teal-50 rounded-full text-teal-700 hover:text-teal-900 text-2xl transition-all active:scale-90"
                  aria-label="Back to Home"
                >
                  ‹
                </button>
              )}
              <h1 className="text-2xl font-black text-center text-teal-900 px-10 leading-tight">
                {title}
              </h1>
            </header>
          )}
          <div className="flex-grow flex flex-col relative overflow-y-auto px-6 sm:px-8 pb-6 sm:pb-8 pt-4 no-scrollbar">
            {children}
          </div>
        </main>
        {footerContent && (
          <footer className="p-6 text-center text-gray-400 border-t border-gray-50 bg-gray-50/30">
            {footerContent}
          </footer>
        )}
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ScreenWrapper;
