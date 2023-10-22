import type { NextPage } from 'next';
import Link from 'next/link';
import Layout from '@/components/layout';
import useSWR from 'swr';
import ProfileImage from '@/components/ProfileImage';
import { IChatManager } from '@/interface/Chat';
import useUser from '@/libs/client/useUser';

interface ChatsResponse {
  result: boolean;
  data: IChatManager[];
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
  const user = useUser();

  if (isLoading) {
    return (
      <CenterContainer>
        <div className="loading loading-spinner loading-lg"></div>
      </CenterContainer>
    );
  }

  return (
    <Layout isViewTabBar title="채팅">
      <div className="mt-5">
        {!data || !data?.data.length ? (
          <CenterContainer>아직 채팅이 없네요</CenterContainer>
        ) : (
          data.data.map((_) => {
            let tUser = _.sellingUser;

            // 같으면 변경.
            if (tUser.id === user.user?.id) {
              tUser = _.buyingUser;
            }

            return (
              <div key={_.id}>
                <Link
                  href={`/chats/${tUser.id}`}
                  className="flex px-2 cursor-pointer items-center space-x-3"
                >
                  <Profile avatar={tUser.avatar} name={tUser.name} />
                </Link>
                <div className="divider my-2"></div>
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
};

const Profile = ({
  name,
  avatar,
}: {
  name?: string;
  avatar?: string | null;
}) => {
  return (
    <>
      <ProfileImage avatar={avatar} />
      <div>
        <p className="">{name}</p>
        <p className="text-xs opacity-">...</p>
      </div>
    </>
  );
};

export default Chats;
