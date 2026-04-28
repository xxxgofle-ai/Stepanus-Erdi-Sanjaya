import { useState } from 'react';
import { getFinancialRecommendations } from '../lib/gemini';
import { Transaction } from '../types';
import { Sparkles, Loader2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  transactions: Transaction[];
}

export default function AIInsights({ transactions }: Props) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    setLoading(true);
    try {
      const result = await getFinancialRecommendations(transactions);
      setInsight(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-2xl p-8 text-[#1E3A8A] relative overflow-hidden" id="ai-insights">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-[#1E40AF] uppercase tracking-wider">Rekomendasi Pintar AI</h3>
        </div>

        <AnimatePresence mode="wait">
          {!insight && !loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <p className="text-[#1E3A8A] text-base font-medium leading-relaxed">
                Biarkan AI menganalisis pola transaksi Anda dan memberikan saran terbaik untuk menghemat pengeluaran bulan ini.
              </p>
              <button
                onClick={generateInsight}
                className="group flex items-center gap-2 bg-[#4F46E5] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#4338CA] transition-all active:scale-95 text-sm"
              >
                Mulai Analisis
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-h-[60px]"
            >
              {loading ? (
                <div className="flex items-center py-4 gap-4">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  <p className="text-blue-800 text-sm font-bold uppercase tracking-widest">Asisten DuitKu sedang berpikir...</p>
                </div>
              ) : (
                <div className="prose prose-blue max-w-none prose-sm text-[#1E3A8A] leading-relaxed whitespace-pre-wrap font-medium">
                  {insight}
                </div>
              )}
              {!loading && (
                <button
                  onClick={generateInsight}
                  className="mt-4 text-[#4F46E5] hover:text-[#4338CA] text-xs font-bold flex items-center gap-2 tracking-wide transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  PERBARUI SARAN
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
