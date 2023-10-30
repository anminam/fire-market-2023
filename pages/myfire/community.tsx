import type { NextPage } from 'next';
import Layout from '@/components/layout';

import useSWR from 'swr';
import useUser from '@/libs/client/useUser';
import { useEffect, useState } from 'react';
import { cls } from '@/libs/client/utils';
import { PostWithUser } from '@/interface/Community';
import CommunitiesByList from '@/components/CommunitiesByList';

interface CommunityResponse {
  result: boolean;
  data: PostWithUser[];
}

const Community: NextPage = () => {
  const { user } = useUser();

  const { data, isLoading } = useSWR<CommunityResponse>(user?.id ? `/api/posts/user/${user.id}` : null);

  const { data: commentsData } = useSWR<CommunityResponse>(`/api/users/my/posts/comments/`);

  const { data: interestData } = useSWR<CommunityResponse>(`/api/users/my/posts/interest/`);

  const [list0, setList0] = useState<PostWithUser[]>([]);
  const [list1, setList1] = useState<PostWithUser[]>([]);
  const [list2, setList2] = useState<PostWithUser[]>([]);

  useEffect(() => {
    if (!data || !data.data) return;
    setList0(data.data);
  }, [data]);

  useEffect(() => {
    if (!commentsData || !commentsData.data) return;
    setList1(commentsData.data);
  }, [commentsData]);

  useEffect(() => {
    if (!interestData || !interestData.data) return;
    setList2(interestData.data);
  }, [interestData]);

  const [tab, setTab] = useState(0);

  return (
    <Layout title="화재생활 활동" canGoBack>
      <div className="">
        <div className="tabs flex text-sm">
          <a
            className={cls(`tab tab-bordered tab-lg flex-1 mt text-sm`, tab === 0 ? 'tab-active' : '')}
            onClick={() => setTab(0)}
          >
            작성한 글 {list0.length ? list0.length : ''}
          </a>
          <a
            className={cls(`tab tab-bordered tab-lg flex-1 mt text-sm`, tab === 1 ? 'tab-active' : '')}
            onClick={() => setTab(1)}
          >
            댓글단 글 {list1.length ? list1.length : ''}
          </a>
          <a
            className={cls(`tab tab-bordered tab-lg flex-1 mt text-sm`, tab === 2 ? 'tab-active' : '')}
            onClick={() => setTab(2)}
          >
            관심 글 {list2.length ? list2.length : ''}
          </a>
        </div>
        {tab === 0 && <CommunitiesByList list={list0} />}
        {tab === 1 && <CommunitiesByList list={list1} />}
        {tab === 2 && <CommunitiesByList list={list2} />}
      </div>
      <div></div>
    </Layout>
  );
};

export default Community;
