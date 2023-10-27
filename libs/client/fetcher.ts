export function fetcher<T>(url: string): Promise<T> {
  return fetch(url).then(res => res.json());
}

export function tokenFetcher<T>([url, token]: string[]): Promise<T> {
  return fetch(url, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.json());
}
