import type { NextPage } from 'next';
import Link from 'next/link';
import Layout from '@/components/layout';
import MyProfileImage from '@/components/MyProfileImage';
import useSWR from 'swr';
import { Chat } from '@prisma/client';

interface ChatsResponse {
  result: boolean;
  data: Chat[];
}

function CenterContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center h-full w-full mt-10">
      {children}
    </div>
  );
}

const Chats: NextPage = () => {
  const { data, isLoading } = useSWR<ChatsResponse>('/api/chats');

  if (isLoading) {
    return (
      <CenterContainer>
        <div className="loading loading-spinner loading-lg"></div>
      </CenterContainer>
    );
  }

  return (
    <Layout isViewTabBar title="채팅">
      <div className="">
        {!data || !data?.data.length ? (
          <CenterContainer>아직 채팅이 없네요</CenterContainer>
        ) : (
          data.data.map((_, i) => (
            <div key={i}>
              <Link
                href={`/chats/${i}`}
                className="flex px-4 cursor-pointer py-3 items-center space-x-3"
              >
                <>
                  <MyProfileImage />
                  <div>
                    <p className="">안미남</p>
                    <p className="text-xs opacity-">
                      더에셋에서 6시반에 만나요
                    </p>
                  </div>
                </>
              </Link>
              <div className="divider"></div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default Chats;
