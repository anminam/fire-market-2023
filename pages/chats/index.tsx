import type { NextPage } from 'next';
import Link from 'next/link';
import Layout from '@/components/layout';

const Chats: NextPage = () => {
  return (
    <Layout hasTabBar title="채팅">
      <div className="divide-y-[1px] ">
        {[1, 1, 1, 1, 1, 1, 1].map((_, i) => (
          <Link
            href={`/chats/${i}`}
            key={i}
            className="flex px-4 cursor-pointer py-3 items-center space-x-3"
          >
            <>
              <div className="w-12 h-12 rounded-full bg-slate-300" />
              <div>
                <p className="text-gray-700">안미남</p>
                <p className="text-sm  text-gray-500">
                  더에셋에서 6시반에 만나요
                </p>
              </div>
            </>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
