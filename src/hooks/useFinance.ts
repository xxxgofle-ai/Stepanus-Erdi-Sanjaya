import { useState, useEffect, useMemo } from 'react';
import { Transaction } from '../types';
import { auth, db } from '../lib/firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  orderBy 
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function useFinance() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      return;
    }

    const path = `users/${user.uid}/transactions`;
    const q = query(collection(db, path), orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Transaction[];
        setTransactions(docs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addTransaction = async (t: Omit<Transaction, 'id'>) => {
    if (!user) return;
    const path = `users/${user.uid}/transactions`;
    try {
      await addDoc(collection(db, path), {
        ...t,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;
    const path = `users/${user.uid}/transactions/${id}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const summary = useMemo(() => {
    return transactions.reduce((acc, t) => {
      if (t.type === 'income') acc.totalIncome += t.amount;
      else acc.totalExpense += t.amount;
      return acc;
    }, { totalIncome: 0, totalExpense: 0 });
  }, [transactions]);

  return {
    user,
    loading,
    transactions,
    addTransaction,
    deleteTransaction,
    summary,
    balance: summary.totalIncome - summary.totalExpense
  };
}
