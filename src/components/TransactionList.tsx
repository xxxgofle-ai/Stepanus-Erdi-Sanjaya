import { Transaction } from '../types';
import { ArrowUpRight, ArrowDownLeft, Trash2, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: Props) {
  if (transactions.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden" id="transaction-list">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900">Transaksi Terbaru</h3>
      </div>

      <div className="divide-y divide-gray-50">
        {transactions.map((t, index) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {t.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 leading-tight text-sm">{t.description || t.category}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.category}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {format(parseISO(t.date), 'dd MMM', { locale: id })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={`text-sm font-bold ${
                t.type === 'income' ? 'text-[#059669]' : 'text-[#DC2626]'
              }`}>
                {t.type === 'income' ? '+' : '-'} Rp {t.amount.toLocaleString()}
              </span>
              <button
                onClick={() => onDelete(t.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-50 text-gray-300 hover:text-rose-600 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
