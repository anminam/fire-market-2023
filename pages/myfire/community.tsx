import type { NextPage } from 'next';
import Layout from '@/components/layout';

import useSWR from 'swr';
import useUser from '@/libs/client/useUser';
import { Product } from '@prisma/client';
import { useEffect, useState } from 'react';
import { cls } from '@/libs/client/utils';
import ProductByList from '@/components/ProductByList';
import { CommunityState } from '@/interface/Community';
import CommunitiesByList from '@/components/CommunitiesByList';

interface CommunityResponse {
  result: boolean;
  data: CommunityState[];
}

const Community: NextPage = () => {
  const { user } = useUser();
  const { data, isLoading } = useSWR<CommunityResponse>(
    user?.id ? `/api/posts/user/${user.id}` : null
  );

  const [list0, setList0] = useState<CommunityState[]>([]);
  const [list1, setList1] = useState<Product[]>([]);
  const [list2, setList2] = useState<Product[]>([]);

  useEffect(() => {
    if (!data || !data.data) return;
    setList0(data.data);
  }, [data]);

  const [tab, setTab] = useState(0);

  return (
    <Layout title="화재생활 활동" canGoBack>
      <div className="">
        <div className="tabs flex text-sm">
          <a
            className={cls(
              `tab tab-bordered tab-lg flex-1 mt text-sm`,
              tab === 0 ? 'tab-active' : ''
            )}
            onClick={() => setTab(0)}
          >
            작성한 글 {list0.length ? list0.length : ''}
          </a>
          <a
            className={cls(
              `tab tab-bordered tab-lg flex-1 mt text-sm`,
              tab === 1 ? 'tab-active' : ''
            )}
            onClick={() => setTab(1)}
          >
            댓글단 글 {list1.length ? list1.length : ''}
          </a>
          <a
            className={cls(
              `tab tab-bordered tab-lg flex-1 mt text-sm`,
              tab === 2 ? 'tab-active' : ''
            )}
            onClick={() => setTab(2)}
          >
            관심 글 {list2.length ? list2.length : ''}
          </a>
        </div>
        {tab === 0 && <CommunitiesByList list={list0} />}
        {tab === 1 && <ProductByList list={list1} />}
        {tab === 2 && <ProductByList list={list2} />}
      </div>
      <div></div>
    </Layout>
  );
};

export default Community;
