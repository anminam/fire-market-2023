import type { NextPage, NextPageContext } from 'next';
import Link from 'next/link';
import Layout from '@/components/layout';
import useUser from '@/libs/client/useUser';
import useSWR, { SWRConfig } from 'swr';
import { Review, User } from '@prisma/client';
import EvaluationItem from '@/components/EvaluationItem';
import { withSSRSession } from '@/libs/server/withSession';
import Image from 'next/image';
import client from '@/libs/server/client';
import PageContentsContainer from '@/components/PageContentsContainer';
import { AiOutlineHeart } from 'react-icons/ai';
import { BiHeart, BiReceipt, BiShoppingBag } from 'react-icons/bi';
import MyProfileImage from '@/components/MyProfileImage';

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
    <PageContentsContainer title="사람들에게 받은 평가">
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
    </PageContentsContainer>
  );
};

// 나의거래
const MyBusiness = () => {
  return (
    <PageContentsContainer title="나의거래">
      <div>
        <ul className="space-y-6">
          <li>
            <Link href="/myfire/loved">
              <div className="flex items-center gap-2">
                <BiHeart size="20" />
                <div>관심목록</div>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/myfire/sale">
              <div className="flex items-center gap-2">
                <BiReceipt size="20" />
                <div>판매내역</div>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/myfire/bought">
              <div className="flex items-center gap-2">
                <BiShoppingBag size="20" />
                <div>구매내역</div>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </PageContentsContainer>
  );
};

const Others = () => {
  return (
    <PageContentsContainer title="기타">
      <div>
        <ul className="space-y-6">
          <li>딩가딩가</li>
        </ul>
      </div>
    </PageContentsContainer>
  );
};

const Profile: NextPage = () => {
  const { user } = useUser();

  return (
    <Layout hasTabBar title="나의 화재">
      <div className="px-4">
        <Link href="/myfire/edit">
          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center space-x-3 ">
              <MyProfileImage />
              <div className="text-xl font-bold ">
                <span className="">{user?.name}</span>
              </div>
            </div>
            <div className="">
              <Link href="/myfire/edit" className="text-sm text-gray-700">
                <button className="btn btn-sm btn-neutral">프로필보기</button>
              </Link>
            </div>
          </div>
        </Link>
        <div className="divider"></div>
        <MyBusiness />
        <div className="divider"></div>
        <Reviews />
        <div className="divider"></div>
        <Others />
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
