import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import TerminalPage from './pages/TerminalPage';
import DatabasePage from './pages/DatabasePage';
import AboutPage from './pages/AboutPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-black text-gray-200 selection:bg-red-900 selection:text-white flex flex-col font-sans">
        {/* Global Background Effects */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-black to-black opacity-50"></div>
        <div className="fixed inset-0 pointer-events-none z-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        <Navbar />
        
        <main className="flex-grow relative z-10 animate-fade-in">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/terminal" element={<TerminalPage />} />
            <Route path="/database" element={<DatabasePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>

        <Footer />

        {/* Floating Action Button - Global */}
        <div className="fixed bottom-8 right-8 z-50">
          <a href="#/terminal" className="w-14 h-14 bg-red-700 rounded-full border-2 border-white shadow-[0_0_15px_rgba(255,0,0,0.5)] flex items-center justify-center hover:scale-110 hover:rotate-90 transition-all duration-300 group text-white no-underline">
            <i className="fa-solid fa-terminal text-white text-xl"></i>
          </a>
        </div>
      </div>
    </Router>
  );
};

export default App;