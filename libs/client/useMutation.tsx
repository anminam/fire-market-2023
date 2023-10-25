import { useState } from 'react';

interface UseMutationState<T> {
  loading: boolean;
  data?: T;
  error?: any;
}

type UseMutationResult<T> = [
  (data: any, method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH') => void,
  UseMutationState<T>
];
export default function useMutation<T = any>(
  url: string
): UseMutationResult<T> {
  const [state, setState] = useState<UseMutationState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  });

  function mutation(
    data: any,
    method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'POST'
  ) {
    setState((prev) => ({ ...prev, loading: true }));

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status === 500) {
          return setState((prev) => ({
            ...prev,
            data,
            loading: false,
            error: true,
          }));
        }

        return res.json().catch(() => {});
      })
      .then((data) => {
        setState((prev) => ({ ...prev, data, loading: false }));
      })
      .catch((error) => {
        setState((prev) => ({ ...prev, error, loading: false }));
      });
    // .finally(() => setState({ ...state, loading: false }));
  }

  return [mutation, { ...state }];
}
