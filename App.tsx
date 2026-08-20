import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';
import { Wallet, CheckSquare, ArrowUpRight, Shield, LogOut } from 'lucide-react';

export default function App() {
  const { user, profile, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) return <div className="flex h-screen items-center justify-center text-emerald-600">Loading...</div>;
  if (!user) return <AuthPage />;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 text-slate-800">
      {/* Top Header */}
      <header className="bg-emerald-600 p-4 text-white shadow-md">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Tumnishe</h1>
          <button onClick={() => supabase.auth.signOut()} className="rounded p-1 hover:bg-emerald-700">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-md p-4">
        {activeTab === 'dashboard' && <DashboardView profile={profile} />}
        {activeTab === 'tasks' && <TasksView />}
        {activeTab === 'withdraw' && <WithdrawView profile={profile} />}
        {activeTab === 'admin' && isAdmin && <AdminView />}
      </main>

      {/* Bottom Navigation (Mobile First) */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-white p-2 shadow-lg">
        <div className="mx-auto flex max-w-md justify-around text-xs">
          <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center p-2 ${activeTab === 'dashboard' ? 'text-emerald-600 font-bold' : 'text-gray-500'}`}>
            <Wallet size={20} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('tasks')} className={`flex flex-col items-center p-2 ${activeTab === 'tasks' ? 'text-emerald-600 font-bold' : 'text-gray-500'}`}>
            <CheckSquare size={20} /> Tasks
          </button>
          <button onClick={() => setActiveTab('withdraw')} className={`flex flex-col items-center p-2 ${activeTab === 'withdraw' ? 'text-emerald-600 font-bold' : 'text-gray-500'}`}>
            <ArrowUpRight size={20} /> Withdraw
          </button>
          {isAdmin && (
            <button onClick={() => setActiveTab('admin')} className={`flex flex-col items-center p-2 ${activeTab === 'admin' ? 'text-emerald-600 font-bold' : 'text-gray-500'}`}>
              <Shield size={20} /> Admin
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
