import type { NextPage } from 'next';
import Link from 'next/link';
import FloatingButton from '@/components/floating-button';
import Layout from '@/components/layout';
import { Stream } from '@prisma/client';
import useSWR from 'swr';
import Image from 'next/image';
import StreamsList from '@/components/StreamsList';
import { HiVideoCamera } from 'react-icons/hi';

export interface StreamsResponse {
  result: boolean;
  data: Stream[];
}

const Live: NextPage = () => {
  const { data } = useSWR<StreamsResponse>('/api/streams?page=1');

  return (
    <Layout hasTabBar title="라이브">
      <div>
        <div className="py-2">
          <StreamsList data={data} />
        </div>
        <FloatingButton href="/streams/create">
          <HiVideoCamera />
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Live;
