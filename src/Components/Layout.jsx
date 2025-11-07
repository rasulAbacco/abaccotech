import React from 'react';
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden pt-10">
      {/* Animated Background - Fixed to cover all pages */}
        <div className="fixed inset-0 opacity-60">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-700 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-700 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar />
        
        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};



export default Layout;