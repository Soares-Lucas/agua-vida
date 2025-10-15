import React from 'react';
import { GoogleIcon } from '../components/icons/GoogleIcon';

const API_URL = process.env.API_URL || 'http://localhost:8000';

interface LoginPageProps {
  onTestDriveLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onTestDriveLogin }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-800 to-blue-950 flex flex-col justify-center items-center p-8 text-white text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-4">Água Vida</h1>
          <p className="text-xl text-blue-100">
            Organize seu dia e deixe a vida fluir.
          </p>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex justify-center items-center bg-slate-50 dark:bg-blue-950 p-8">
        <div className="w-full max-w-sm text-center">
          <h2 className="text-3xl font-semibold mb-2 text-slate-800 dark:text-slate-100">Bem-vindo(a)</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Faça login para continuar para o seu painel.</p>
          <a
            href={`${API_URL}/auth/google`}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm text-base font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <GoogleIcon className="w-5 h-5 mr-3" />
            Login com Google
          </a>
          <div className="my-4 flex items-center">
            <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
            <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-sm">OU</span>
            <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
          </div>
          <button
            onClick={onTestDriveLogin}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-blue-500 rounded-lg shadow-sm text-base font-medium text-blue-600 dark:text-blue-400 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            Teste Drive
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
