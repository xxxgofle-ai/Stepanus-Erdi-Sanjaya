import { useFinance } from './hooks/useFinance';
import TransactionForm from './components/TransactionForm';
import Charts from './components/Charts';
import AIInsights from './components/AIInsights';
import TransactionList from './components/TransactionList';
import { Wallet, TrendingUp, TrendingDown, Bell, LogIn, Loader2, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { signInWithGoogle, auth } from './lib/firebase';

export default function App() {
  const { user, loading, transactions, addTransaction, deleteTransaction, summary, balance } = useFinance();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-indigo-950 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -ml-48 -mb-48" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative z-10 text-center"
        >
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-200">
            <Wallet className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-indigo-950 mb-3 tracking-tight">DuitKu</h1>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            Kelola keuangan pribadi Anda dengan lebih cerdas menggunakan asisten AI.
          </p>
          
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-4 px-6 rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg"
          >
            <LogIn className="w-5 h-5" />
            Masuk dengan Google
          </button>
          
          <p className="mt-8 text-xs text-gray-400 font-medium uppercase tracking-widest">
            Aman • Privat • Cerdas
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex text-[#111827]">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-[#E5E7EB] flex flex-col hidden lg:flex">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#4F46E5] rounded-lg"></div>
          <h1 className="text-xl font-extrabold text-[#4F46E5] tracking-tight">DuitKu</h1>
        </div>

        <nav className="px-4 flex-1 space-y-1">
          <div className="flex items-center gap-3 px-4 py-3 bg-[#EEF2FF] text-[#4F46E5] rounded-xl font-semibold transition-all cursor-pointer">
            <Wallet className="w-5 h-5" />
            <span>Ringkasan</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-[#4B5563] hover:bg-gray-50 rounded-xl font-medium transition-all cursor-pointer">
            <TrendingUp className="w-5 h-5" />
            <span>Transaksi</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-[#4B5563] hover:bg-gray-50 rounded-xl font-medium transition-all cursor-pointer">
            <Bell className="w-5 h-5" />
            <span>Notifikasi</span>
          </div>
        </nav>

        <div className="p-6">
          <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-2xl p-4">
            <p className="text-[11px] font-bold text-[#1E40AF] uppercase tracking-wider mb-2">Tips Profil</p>
            <p className="text-xs text-[#1E3A8A] leading-relaxed">
              Lengkapi informasi profil Anda untuk mendapatkan analisis AI yang lebih akurat.
            </p>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3">
            <img 
              src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              alt="avatar" 
            />
            <div className="flex-1 min-w-0">
               <p className="text-sm font-bold truncate">{user.displayName}</p>
               <button onClick={() => auth.signOut()} className="text-xs text-rose-500 font-bold hover:underline">Keluar</button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto">
        <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#4F46E5] rounded-md"></div>
            <span className="font-bold">DuitKu</span>
          </div>
          <button onClick={() => auth.signOut()} className="text-gray-400">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
          {/* Welcome section with button in top right */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div>
                <h2 className="text-3xl font-bold tracking-tight">Halo, {user.displayName?.split(' ')[0] || 'Teman'}</h2>
                <p className="text-[#6B7280] mt-1">Berikut ringkasan keuanganmu hari ini.</p>
             </div>
             {/* Mobile hidden here as floating button is present, or used as a secondary action */}
          </div>

          {/* Clean Minimalism Stats Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
               <span className="text-[12px] text-[#6B7280] font-bold uppercase tracking-widest block mb-2">Saldo Total</span>
               <span className="text-2xl font-bold text-[#2563EB]">Rp {balance.toLocaleString()}</span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
               <span className="text-[12px] text-[#6B7280] font-bold uppercase tracking-widest block mb-2">Pemasukan</span>
               <span className="text-2xl font-bold text-[#059669]">+ Rp {summary.totalIncome.toLocaleString()}</span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
               <span className="text-[12px] text-[#6B7280] font-bold uppercase tracking-widest block mb-2">Pengeluaran</span>
               <span className="text-2xl font-bold text-[#DC2626]">- Rp {summary.totalExpense.toLocaleString()}</span>
            </div>
          </section>

          {/* AI Section with theme match */}
          <section>
            <AIInsights transactions={transactions} />
          </section>

          {/* Visualization Section */}
          <section className="space-y-6">
             <Charts transactions={transactions} />
          </section>
          
          {/* Bottom Grid Layout inspired by theme */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
             <div className="xl:col-span-2 space-y-6">
                <TransactionList transactions={transactions} onDelete={deleteTransaction} />
             </div>
             <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                   <h3 className="text-base font-bold mb-6">Alokasi Kategori</h3>
                   <div className="space-y-6">
                      {transactions.filter(t => t.type === 'expense').slice(0, 4).reduce((acc, t) => {
                        const exist = acc.find(x => x.cat === t.category);
                        if (exist) exist.val += t.amount;
                        else acc.push({ cat: t.category, val: t.amount });
                        return acc;
                      }, [] as { cat: string; val: number }[]).map((c, i) => (
                        <div key={c.cat} className="space-y-2">
                           <div className="flex justify-between text-xs font-bold">
                              <span className="text-gray-500 uppercase tracking-wider">{c.cat}</span>
                              <span className="text-indigo-600">Rp {c.val.toLocaleString()}</span>
                           </div>
                           <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (c.val / (summary.totalExpense || 1)) * 100)}%` }}
                                className={`h-full rounded-full ${['bg-amber-500', 'bg-purple-500', 'bg-rose-500', 'bg-blue-500'][i % 4]}`}
                              />
                           </div>
                        </div>
                      ))}
                      {transactions.filter(t => t.type === 'expense').length === 0 && (
                        <p className="text-sm text-gray-400 italic">Belum ada data pengeluaran.</p>
                      )}
                   </div>
                </div>
             </div>
          </section>
        </div>
      </main>

      <TransactionForm onAdd={addTransaction} />
    </div>
  );
}
