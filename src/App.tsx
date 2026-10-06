import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { SSOModal } from './components/SSOModal';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { ToastContainer } from './components/ToastContainer';

const MainView: React.FC = () => {
  const { currentPage } = useApp();

  return (
    <div className="min-h-screen bg-[#061224] selection:bg-[#0066FF] selection:text-white">
      {/* Toast Notification Layer */}
      <ToastContainer />

      {/* Primary Authentication Interface */}
      {currentPage === 'signup' ? <SignupPage /> : <LoginPage />}

      {/* Accessible Modals */}
      <SSOModal />
      <ForgotPasswordModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainView />
    </AppProvider>
  );
}
