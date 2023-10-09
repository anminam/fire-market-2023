import type { NextPage, NextPageContext } from 'next';
import Link from 'next/link';
import Layout from '@/components/layout';
import useUser from '@/libs/client/useUser';
import useSWR, { SWRConfig } from 'swr';
import { Review, User } from '@prisma/client';
import EvaluationItem from '@/components/EvaluationItem';
import { withSSRSession } from '@/libs/server/withSession';
import Image from 'next/image';

interface ReviewWithUser extends Review {
  createdBy: User;
}
interface ReviewResponse {
  result: boolean;
  data: ReviewWithUser[];
}

const Reviews: NextPage = () => {
  const { data } = useSWR<ReviewResponse>('/api/users/my/reviews');
  return (
    <div>
      <h1 className="mt-12 pb-4 font-bold text-xl text-gray-800 border-b ">
        사람들에게 받은 평가
      </h1>
      <ul>
        {data?.data?.map((_) => {
          return (
            <EvaluationItem
              key={_.id}
              comment={_.review}
              id={_.createdBy.id}
              name={_.createdBy.name}
              star={_.rating}
            />
          );
        })}
      </ul>
    </div>
  );
};

const Profile: NextPage = () => {
  const { user } = useUser();

  return (
    <Layout hasTabBar title="나의 화재">
      <div className="px-4">
        <div className="flex items-center mt-4 space-x-3">
          {user?.avatar ? (
            <Image
              height={64}
              width={64}
              alt="avatar"
              src={`https://imagedelivery.net/6-jfB1-8fzgOcmfBEr6cGA/${user?.avatar}/avatar`}
              className="w-16 h-16 bg-slate-500 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 bg-slate-500 rounded-full" />
          )}
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{user?.name}</span>
            <Link href="/profile/edit" className="text-sm text-gray-700">
              내 정보 수정하기
            </Link>
          </div>
        </div>
        <div className="mt-10 flex justify-around">
          <Link href="/profile/sale" className="flex flex-col items-center">
            <div className="w-14 h-14 text-white bg-blue-400 rounded-full flex items-center justify-center">
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
            <span className="text-sm mt-2 font-medium text-gray-700">
              판매내역
            </span>
          </Link>
          <Link href="/profile/bought" className="flex flex-col items-center">
            <div className="w-14 h-14 text-white bg-blue-400 rounded-full flex items-center justify-center">
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                ></path>
              </svg>
            </div>
            <span className="text-sm mt-2 font-medium text-gray-700">
              구매내역
            </span>
          </Link>
          <Link href="/profile/loved" className="flex flex-col items-center">
            <div className="w-14 h-14 text-white bg-blue-400 rounded-full flex items-center justify-center">
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
            </div>
            <span className="text-sm mt-2 font-medium text-gray-700">
              관심목록
            </span>
          </Link>
        </div>
        <Reviews />
      </div>
    </Layout>
  );
};

const Page: NextPage<{ data: User }> = ({ data }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          '/api/users/my': {
            result: true,
            data,
          },
        },
      }}
    >
      <Profile />
    </SWRConfig>
  );
};

export const getServerSideProps = withSSRSession(async function ({
  req,
}: NextPageContext) {
  const data = await client?.user.findUnique({
    where: {
      id: req?.session.user?.id,
    },
  });

  return {
    props: {
      data: JSON.parse(JSON.stringify(data)),
    },
  };
});

export default Page;
