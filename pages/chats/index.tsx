import type { NextPage } from 'next';
import Link from 'next/link';
import Layout from '@/components/layout';
import useSWR from 'swr';
import { IRoom } from '@/interface/Chat';
import useUser from '@/libs/client/useUser';
import ChatThumbnailItem from '@/components/ChatThumbnailItem';
import useFirebaseUser from '@/hooks/useFirebaseUser';
import { tokenFetcher } from '@/libs/client/fetcher';
import { chatUrl } from '@/libs/client/url';
import { useEffect, useState } from 'react';

interface IRoomResponse {
  rooms: IRoom[];
}

function CenterContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center h-full w-full mt-10">
      {children}
    </div>
  );
}

const Chats: NextPage = () => {
  const user = useUser();
  const { token } = useFirebaseUser();
  const [rooms, setRooms] = useState<IRoom[] | null>(null);

  const {
    data: roomData,
    isLoading,
    error,
  } = useSWR<IRoomResponse>(
    token ? [`${chatUrl}/api/rooms`, token] : null,
    tokenFetcher
  );

  useEffect(() => {
    if (!roomData) return;
    setRooms(roomData.rooms);
  }, [roomData]);

  return (
    <Layout isViewTabBar title="채팅">
      <div className="mt-4">
        {/* 로딩 */}
        {isLoading && (
          <CenterContainer>
            <div className="loading loading-spinner loading-lg"></div>
          </CenterContainer>
        )}
        {/* 받았는데 리스트가 존재하지 않으면 */}
        {rooms && !rooms.length && (
          <CenterContainer>아직 채팅이 없네요</CenterContainer>
        )}
        {rooms?.map(_ => {
          let tUser = _.seller;

          // 같으면 변경.
          if (tUser.id === user.user?.id) {
            tUser = _.buyer;
          }

          const textList = _.text.split('::');

          return (
            <div key={_.roomNm}>
              <Link href={`/chats/${_.roomNm}`} className="space-x-3">
                <ChatThumbnailItem
                  avatar={tUser.avatar}
                  name={tUser.name}
                  text={textList[2]}
                  date={_.updatedAt}
                  productImage={_.product.image}
                  productImageAlt={_.product.name}
                />
              </Link>
              <div className="divider my-2"></div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default Chats;
