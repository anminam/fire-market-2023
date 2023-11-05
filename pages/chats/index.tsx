import type { NextPage } from 'next';
import Link from 'next/link';
import Layout from '@/components/layout';
import useUser from '@/libs/client/useUser';
import ChatThumbnailItem from '@/components/ChatThumbnailItem';
import { useMiniStore } from '@/hooks/useStore';

function CenterContainer({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-center items-center h-full w-full mt-10">{children}</div>;
}

const Chats: NextPage = () => {
  const user = useUser();
  const rooms = useMiniStore((_) => _.rooms);

  return (
    <Layout isViewTabBar title="채팅">
      <div className="divide-y divide-[hsl(var(--bc)/20%)]">
        {/* 받았는데 리스트가 존재하지 않으면 */}
        {rooms && !rooms.length && <CenterContainer>아직 채팅이 없네요</CenterContainer>}
        {rooms?.map((_) => {
          let tUser = _.seller;

          // 같으면 변경.
          if (tUser.id === user.user?.id) {
            tUser = _.buyer;
          }

          const textList = _.text.split('::');

          return (
            <div key={_.roomNm} className="space-x-3 py-4">
              <Link href={`/chats/${_.roomNm}`}>
                <ChatThumbnailItem
                  avatar={tUser.avatar}
                  name={tUser.name}
                  text={textList[2]}
                  date={_.updatedAt}
                  productImage={_.product.image}
                  productImageAlt={_.product.name}
                  readCount={_.readCount}
                />
              </Link>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default Chats;
