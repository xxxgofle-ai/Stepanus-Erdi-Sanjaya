import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Transaction } from '../types';
import { format, parseISO } from 'date-fns';

interface Props {
  transactions: Transaction[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function Charts({ transactions }: Props) {
  const dailyData = useMemo(() => {
    // Last 14 days for a longer trend line if possible, or stick to 7 as per design 6 months bars
    // But Recharts area looks better with daily points
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return format(d, 'yyyy-MM-dd');
    }).reverse();

    return last7Days.map(date => {
      const dayTransactions = transactions.filter(t => t.date === date);
      const income = dayTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = dayTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      return {
        name: format(parseISO(date), 'dd MMM', { locale: id }),
        income,
        expense
      };
    });
  }, [transactions]);

  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categories = Array.from(new Set(expenses.map(t => t.category)));
    return categories.map(cat => ({
      name: cat,
      value: expenses.filter(t => t.category === cat).reduce((s, t) => s + t.amount, 0)
    })).sort((a, b) => b.value - a.value).slice(0, 5);
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-[#6B7280] border-2 border-dashed border-[#E5E7EB] rounded-2xl bg-white">
        Belum ada data untuk ditampilkan
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]" id="trend-chart">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-base font-bold">Tren Arus Kas</h3>
           <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-[#A7F3D0]" />
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Masuk</span>
              </div>
              <div className="flex items-center gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-[#FECACA]" />
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Keluar</span>
              </div>
           </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A7F3D0" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#A7F3D0" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FECACA" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FECACA" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }} dy={10} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontSize: '10px', color: '#9CA3AF', fontWeight: '800', marginBottom: '4px', textTransform: 'uppercase' }}
                formatter={(value: number) => [`Rp ${value.toLocaleString()}`, '']}
              />
              <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]" id="category-chart">
        <h3 className="text-base font-bold mb-8">Proporsi Pengeluaran</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                innerRadius={65}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 formatter={(value: number) => [`Rp ${value.toLocaleString()}`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 space-y-3">
          {categoryData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{item.name}</span>
              </div>
              <span className="text-xs font-bold text-gray-900">Rp {item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { id } from 'date-fns/locale';
