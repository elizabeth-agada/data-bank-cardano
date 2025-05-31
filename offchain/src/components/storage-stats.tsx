"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

interface StorageStatsProps {
  userId: string;
  maxStorage?: number; // Maximum storage in GB, default is 30GB
}

export default function StorageStats({ userId, maxStorage = 30 }: StorageStatsProps) {
  const [storageData, setStorageData] = useState({
    usedSize: 0,
    usedUnit: 'KB',
    totalGB: maxStorage,
    percentage: 0,
    isLoading: true,
    documentCount: 0
  });

  useEffect(() => {
    const fetchUserDocuments = async () => {
      
      if (!userId) {
        return;
      }
      
      try {
        
        // Get distinct documents to avoid duplicates
        const { data: userDocs, error } = await supabase
          .from('documents')
          .select('document_size, id')
          .eq('owner_address', userId);
        
        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }

        const uniqueDocIds = new Set();
        const uniqueDocs = userDocs?.filter(doc => {
          if (uniqueDocIds.has(doc.id)) return false;
          uniqueDocIds.add(doc.id);
          return true;
        }) || [];

        
        // Calculate total size - assuming sizes could be in bytes instead of KB
        let totalSizeInBytes = 0;
        if (uniqueDocs.length > 0) {
          // Parse string values to numbers
          totalSizeInBytes = uniqueDocs.reduce((total, doc) => {
            // Convert string to number if it's a string
            const docSize = typeof doc.document_size === 'string' 
              ? parseFloat(doc.document_size) 
              : (typeof doc.document_size === 'number' ? doc.document_size : 0);
              
            return total + docSize;
          }, 0);
        }

        
        // Convert to appropriate units for display
        // Try interpreting the size as bytes first
        let usedSize, usedUnit;
        let sizeInGB;
        
        if (totalSizeInBytes > 1073741824) { // 1 GB in bytes
          // Size is probably already in KB if it's this large
          usedSize = parseFloat((totalSizeInBytes / 1048576).toFixed(2)); // KB to GB
          usedUnit = 'GB';
          sizeInGB = usedSize;
        } else {
          // Treat as bytes and convert up
          if (totalSizeInBytes >= 1073741824) { // 1 GB in bytes
            usedSize = parseFloat((totalSizeInBytes / 1073741824).toFixed(2));
            usedUnit = 'GB';
            sizeInGB = usedSize;
          } else if (totalSizeInBytes >= 1048576) { // 1 MB in bytes
            usedSize = parseFloat((totalSizeInBytes / 1048576).toFixed(2));
            usedUnit = 'MB';
            sizeInGB = usedSize / 1024;
          } else if (totalSizeInBytes >= 1024) { // 1 KB in bytes
            usedSize = parseFloat((totalSizeInBytes / 1024).toFixed(2));
            usedUnit = 'KB';
            sizeInGB = usedSize / 1048576;
          } else {
            usedSize = totalSizeInBytes;
            usedUnit = 'bytes';
            sizeInGB = totalSizeInBytes / 1073741824;
          }
        }

        
        // Calculate percentage (capped at 100%)
        const percentage = Math.min((sizeInGB / maxStorage) * 100, 100);

        setStorageData({
          usedSize,
          usedUnit,
          totalGB: maxStorage,
          percentage,
          isLoading: false,
          documentCount: uniqueDocs.length
        });
        
      } catch (error) {
        console.error('Error fetching user documents:', error);
        setStorageData(prev => ({ ...prev, isLoading: false }));
      }
      
    };

    fetchUserDocuments();
  }, [userId, maxStorage]);

  return (
    <div className="bg-[#040E24] rounded-2xl p-6 border border-[#3A4358]">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-400 text-sm mb-2">Storage</h3>
          {storageData.isLoading ? (
            <div className="text-3xl font-bold">Loading...</div>
          ) : (
            <div>
              <div className="text-lg font-bold">
                {storageData.usedSize} {storageData.usedUnit} of {storageData.totalGB} GB
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Documents: {storageData.documentCount}
              </div>
            </div>
          )}
        </div>
        <Image 
          src="/img/store.png" 
          alt="Hard Drive" 
          width={24} 
          height={24}
          priority
        />
      </div>
      <div className="mt-4 bg-[#3A4358] rounded-full h-2 overflow-hidden">
        {!storageData.isLoading && (
          <div 
            className="bg-[#2B9DDA] h-full rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${Math.max(storageData.percentage, 0.5)}%` }}
          />
        )}
      </div>
    </div>
  );
}