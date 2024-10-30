'use client';

import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { User } from '@/lib/definitions';

interface UserContextType {
  userName: string;
  corporationImg: string;
  corporationId: string;
  error: string | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode; userId: string }> = ({ children, userId }) => {
  const [userName, setUserName] = useState<string>('');
  const [corporationImg, setCorporationImg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [corporationId, setCorporationId] = useState<string>('');

  const fetchUserData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: User = await response.json();
      setUserName(data.staff?.fullName ?? '');
      setCorporationImg(data.corporation?.image ?? '');
      setCorporationId(data.corporationId?.toString() ?? '');
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError('Error fetching user data: ' + err.message);
      } else {
        setError('Error fetching user data');
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const refetch = useCallback(() => fetchUserData(), [fetchUserData]);

  const value = useMemo(() => ({
    userName,
    corporationImg,
    corporationId,
    error,
    loading,
    refetch
  }), [userName, corporationImg, corporationId, error, loading, refetch]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};