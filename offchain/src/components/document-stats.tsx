import { supabase } from '@/utils/supabase';
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';

interface DocumentStatsProps {
  userId: string;
}

export default function DocumentStats({ userId }: DocumentStatsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalDocuments, setTotalDocuments] = useState<number>(0);

  useEffect(() => {
    const fetchTotalDocuments = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error, count } = await supabase
          .from('documents')
          .select('*', { count: 'exact' })
          .eq('owner_address', userId);
          
        if (error) {
          throw error;
        }
        
        setTotalDocuments(count || 0);
        console.log(data)
      } catch (err) {
        console.error('Error fetching document count:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch documents'));
        toast.error('Failed to load document count');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalDocuments();
  }, [userId]);

  return (
    <div className="bg-[#040E24] rounded-2xl p-6 border border-[#3A4358]">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-400 text-sm mb-2">Total Documents</h3>
          {isLoading ? (
            <div className="text-3xl font-bold">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-sm">Error loading data</div>
          ) : (
            <div className="text-3xl font-bold">{totalDocuments.toLocaleString()}</div>
          )}
        </div>
        <div className="bg-[#071A32] p-2 rounded-full">
          <Image src="/img/document.png" alt="Document" width={24} height={24} />
        </div>
      </div>
    </div>
  );
}