import type { NextPage } from 'next';
import FloatingButton from '@/components/floating-button';
import Layout from '@/components/layout';
import { Stream } from '@prisma/client';
import useSWR from 'swr';
import StreamsList from '@/components/StreamsList';
import { HiVideoCamera } from 'react-icons/hi';
import useUser from '@/libs/client/useUser';
import { CenterContainer } from '@/components/CenterContainer';

export interface StreamsResponse {
  result: boolean;
  data: Stream[];
}

const Live: NextPage = () => {
  const { user } = useUser();
  const { data } = useSWR<StreamsResponse>('/api/streams?page=1');

  return (
    <Layout isViewTabBar title="라이브">
      <div>
        {/* {user?.canStream ? ( */}
        <div className="py-4">
          <StreamsList data={data} />
        </div>
        {/* ) : (
          <CenterContainer>2023년 11월 10일 대공개!</CenterContainer>
        )} */}
        {user?.canStream && (
          <FloatingButton href="/streams/create" title="올리기">
            <HiVideoCamera />
          </FloatingButton>
        )}
      </div>
    </Layout>
  );
};

export default Live;
