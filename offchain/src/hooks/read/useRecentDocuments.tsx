"use client"; 

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { toast } from 'react-hot-toast';
import { useWallet } from "@/components/contexts/wallet/WalletContext";

export interface RecentDocument {
  id: string;
  name: string;
  date: string;
  size: string;
  type: string;
  sharedWith: { id: number; avatar: string }[];
}

interface DocumentData {
  id: string;
  document_name?: string;
  created_at: string;
  document_size?: string;
  document_type?: string;
}

export function useRecentDocuments(limit: number = 6) {
    const [walletConnection, setWalletConnection] = useWallet();
    const { address } = walletConnection;
  const [documents, setDocuments] = useState<RecentDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRecentDocuments() {
      try {
        setIsLoading(true);
        
        // Fetch documents from Supabase
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('owner_address', address)
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (error) {
          throw error;
        }
        
        if (!data || data.length === 0) {
          setDocuments([]);
          return;
        }
        
        // Format documents without sharing information
        const formattedDocuments = data.map((doc: DocumentData) => ({
          ...formatDocument(doc),
          sharedWith: []
        }));
        
        setDocuments(formattedDocuments);
      } catch (err) {
        console.error('Error fetching recent documents:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch documents'));
        toast.error('Failed to load recent documents');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRecentDocuments();
  }, [limit, address]); // Added 'address' to the dependency array
  
  // Helper function to format document data
  function formatDocument(doc: DocumentData): Omit<RecentDocument, 'sharedWith'> {
    const date = new Date(doc.created_at);
    const formattedDate = date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    
    return {
      id: doc.id,
      name: doc.document_name || 'Unnamed Document',
      date: formattedDate,
      size: doc.document_size ? `${(Number(doc.document_size) / (1024 * 1024)).toFixed(1)}MB` : 'Unknown',
      type: doc.document_type || 'Unknown',
    };
  }
  
  return { documents, isLoading, error };
}