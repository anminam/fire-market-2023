import { User } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

interface ProfileResponse {
  result: boolean;
  data: User;
}

export default function useUser() {
  const { data, error } = useSWR<ProfileResponse>('/api/users/my');
  const router = useRouter();

  useEffect(() => {
    if (data && !data.result) {
      router.replace('/join');
      return;
    }
  }, [data, router]);

  return { user: data?.data, isLoading: !data && !error };
}
