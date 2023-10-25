import type { NextPage } from 'next';
import FloatingButton from '@/components/floating-button';
import Layout from '@/components/layout';
import { Post, User } from '@prisma/client';
import PostItem from '@/components/PostItem';
import client from '@/libs/server/client';
import { HiPencil } from 'react-icons/hi';
import useSWR from 'swr';

interface PostWithUser extends Post {
  user: User;
  _count: {
    Wonderings: number;
    Answers: number;
  };
}
interface PostResponse {
  posts: PostWithUser[];
}

const Community = () => {
  const { data, isLoading } = useSWR<PostResponse>('/api/posts');
  return (
    <Layout isViewTabBar title="화재생활">
      <div className="divide-y-[1px] divide-neutral">
        {data?.posts.map((_, i) => (
          <div key={i} className="">
            <PostItem
              content={_.question}
              createdAt={_.createdAt.toString()}
              id={_.id.toString()}
              name={_.user.name}
              answer={_._count?.Answers}
              wondering={_._count?.Wonderings}
            />
          </div>
        ))}
        <FloatingButton href="/community/write">
          <HiPencil />
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Community;
