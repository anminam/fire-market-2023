import type { NextPage } from 'next';
import Link from 'next/link';
import FloatingButton from '@/components/floating-button';
import Layout from '@/components/layout';
import useSWR from 'swr';
import { Post, User } from '@prisma/client';
import PostItem from '@/components/PostItem';
import client from '@/libs/server/client';

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
      <div className="space-y-4 divide-y-[2px]">
        {posts?.map((_, i) => (
          <PostItem
            key={i}
            content={_.question}
            createdAt={_.createdAt.toString()}
            id={_.id.toString()}
            name={_.user.name}
            answer={_._count?.Answers}
            wondering={_._count?.Wonderings}
          />
        ))}
        <FloatingButton href="/community/write">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            ></path>
          </svg>
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
