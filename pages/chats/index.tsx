import type { NextPage } from 'next';
import Link from 'next/link';
import Layout from '@/components/layout';
import MyProfileImage from '@/components/MyProfileImage';

const Chats: NextPage = () => {
  return (
    <Layout isViewTabBar title="채팅">
      <div className="divide-y-[1px] divide-neutral">
        {[1, 1, 1, 1, 1, 1, 1].map((_, i) => (
          <Link
            href={`/chats/${i}`}
            key={i}
            className="flex px-4 cursor-pointer py-3 items-center space-x-3"
          >
            <>
              <MyProfileImage />
              <div>
                <p className="">안미남</p>
                <p className="text-xs opacity-">더에셋에서 6시반에 만나요</p>
              </div>
            </>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
