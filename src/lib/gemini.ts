import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getFinancialRecommendations(transactions: Transaction[]) {
  if (transactions.length === 0) {
    return "Mulai catat transaksi Anda untuk mendapatkan saran keuangan yang dipersonalisasi.";
  }

  const summary = transactions.reduce((acc, t) => {
    if (t.type === 'income') acc.income += t.amount;
    else acc.expense += t.amount;
    return acc;
  }, { income: 0, expense: 0 });

  const categorySpending = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const prompt = `
    Anda adalah konsultan keuangan pribadi. Berikan saran singkat dan efektif berdasarkan data transaksi bulan ini:
    - Total Pemasukan: Rp ${summary.income.toLocaleString()}
    - Total Pengeluaran: Rp ${summary.expense.toLocaleString()}
    - Pengeluaran per Kategori: ${JSON.stringify(categorySpending)}

    Berikan 3 poin utama dalam Bahasa Indonesia:
    1. Analisis kesehatan keuangan.
    2. Rekomendasi untuk menabung atau mengurangi pengeluaran.
    3. Prediksi atau saran umum untuk bulan depan.
    
    Format output harus dalam Markdown yang rapi.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Gagal mendapatkan saran. Coba lagi nanti.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi kesalahan saat menghubungi asisten AI.";
  }
}
