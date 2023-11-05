import type { NextPage } from 'next';
import FloatingButton from '@/components/floating-button';
import Layout from '@/components/layout';
import { Stream } from '@prisma/client';
import useSWR from 'swr';
import StreamsList from '@/components/StreamsList';
import { HiVideoCamera } from 'react-icons/hi';

export interface StreamsResponse {
  result: boolean;
  data: Stream[];
}

const Live: NextPage = () => {
  const { data } = useSWR<StreamsResponse>('/api/streams?page=1');

  return (
    <Layout isViewTabBar title="라이브">
      <div>
        <div className="py-4">
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
