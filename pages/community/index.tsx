import type { NextPage } from 'next';
import Link from 'next/link';
import FloatingButton from '@/components/floating-button';
import Layout from '@/components/layout';
import useSWR from 'swr';
import { Post, User } from '@prisma/client';
import PostItem from '@/components/PostItem';
import client from '@/libs/server/client';
import { HiPencil } from 'react-icons/hi';

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

const Community: NextPage<PostResponse> = ({ posts }) => {
  // const { data, isLoading } = useSWR<PostResponse>('/api/posts');

  return (
    <Layout hasTabBar title="화재생활">
      <div className="neutral divide-y-[1px] divide-neutral">
        {posts?.map((_, i) => (
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

export async function getStaticProps() {
  console.log('만들어버려라!!!!!!');
  const posts = await client.post.findMany({ include: { user: true } });
  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
    },
    // revalidate: 120,
  };
}

export default Community;
