import React, { useState } from 'react';
import { CATEGORIES } from '../types';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onAdd: (t: { type: 'income' | 'expense'; amount: number; category: string; description: string; date: string }) => void;
}

export default function TransactionForm({ onAdd }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES.expense[0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    
    onAdd({
      type,
      amount: Number(amount),
      category,
      description,
      date
    });

    setAmount('');
    setDescription('');
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        id="add-transaction-btn"
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#4F46E5] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-indigo-200 transition-all z-50 group"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100"
              id="transaction-modal"
            >
              <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <h2 className="text-base font-bold text-gray-900 uppercase tracking-widest leading-none">Tambah Transaksi</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="flex p-0.5 bg-gray-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => { setType('expense'); setCategory(CATEGORIES.expense[0]); }}
                    className={`flex-1 py-2 text-[10px] font-extrabold uppercase tracking-widest rounded-lg transition-all ${type === 'expense' ? 'bg-white text-[#4F46E5] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Pengeluaran
                  </button>
                  <button
                    type="button"
                    onClick={() => { setType('income'); setCategory(CATEGORIES.income[0]); }}
                    className={`flex-1 py-2 text-[10px] font-extrabold uppercase tracking-widest rounded-lg transition-all ${type === 'income' ? 'bg-white text-[#4F46E5] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Pemasukan
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Jumlah</label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-xl font-bold tracking-tight"
                    id="amount-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Kategori</label>
                    <div className="relative">
                       <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-indigo-500 transition-all appearance-none text-xs font-bold text-gray-700"
                       >
                        {(type === 'income' ? CATEGORIES.income : CATEGORIES.expense).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                       </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Tanggal</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-indigo-500 transition-all text-xs font-bold text-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Keterangan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Makan siang"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-indigo-500 transition-all text-xs font-bold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#4F46E5] text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg hover:bg-[#4338CA] active:scale-[0.98] transition-all pt-2"
                  id="submit-transaction"
                >
                  Simpan Transaksi
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
