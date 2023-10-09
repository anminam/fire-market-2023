import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Button from '@/components/button';
import Layout from '@/components/layout';
import { useRouter } from 'next/router';
import { Product, User } from '@prisma/client';
import Link from 'next/link';
import useMutation from '@/libs/client/useMutation';
import { cls, moneyFormat } from '@/libs/client/utils';
import Image from 'next/image';
import client from '@/libs/server/client';

interface ProductWithUser extends Product {
  user: User;
}

interface ItemDetailResult {
  result: boolean;
  product: ProductWithUser;
  isLike: boolean;
  relatedProducts: Product[];
}
const ItemDetail: NextPage<ItemDetailResult> = ({
  product,
  relatedProducts,
  isLike,
}) => {
  const router = useRouter();
  // const { data, mutate: boundMutate } = useSWR<ItemDetailResult>(
  //   router.query.id ? `/api/products/${router.query.id}` : null
  // );

  const [toggleFav] = useMutation(`/api/products/${router.query.id}/favorite`);
  const onFavClick = () => {
    // if (!data) return;
    // boundMutate(
    //   (prev: any) => prev && { ...prev, isLike: !prev.isLike },
    //   false
    // );
    // toggleFav({});
  };

  if (router.isFallback) {
    return <div>로딩중...</div>;
  }

  return (
    <Layout canGoBack title={`상품 | ${product.name}`}>
      <div className="px-4 py-4">
        <div className="mb-8">
          <div className="relative pb-80">
            <Image
              alt={product.name + ' 이미지'}
              layout="fill"
              src={`https://imagedelivery.net/6-jfB1-8fzgOcmfBEr6cGA/${product.image}/public`}
              className="h-96 bg-slate-300 object-cover"
            />
          </div>

          <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
            <Image
              alt={`${product.user?.name}의 아바타`}
              width={48}
              height={48}
              src={`https://imagedelivery.net/6-jfB1-8fzgOcmfBEr6cGA/${product.user.avatar}/avatar`}
              className="w-12 h-12 rounded-full bg-slate-300"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {product.user?.name}
              </p>
              <Link href={`/users/products/${product.user?.id}`}>
                <p className="text-xs font-medium text-gray-500">프로필 보기</p>
              </Link>
            </div>
          </div>

          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <span className="text-2xl block mt-3 text-gray-900">
              {product && moneyFormat(product.price)} 원
            </span>
            <p className=" my-6 text-gray-700">{product.description}</p>
            <div className="flex items-center justify-between space-x-2">
              <Button large text="채팅하기" />
              <button
                onClick={onFavClick}
                className={cls(
                  'p-3 rounded-md flex items-center justify-center',
                  isLike
                    ? 'text-red-400 hover:bg-red-100 hover:text-red-500'
                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-500'
                )}
              >
                {isLike ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        {relatedProducts?.length ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900">비슷한 물건</h2>
            <div className=" mt-6 grid grid-cols-2 gap-4">
              {relatedProducts?.map((_: any, i: any) => {
                return (
                  <Link href={`/products/${_.id}`} key={_.id}>
                    <Image
                      alt={''}
                      src={`https://imagedelivery.net/6-jfB1-8fzgOcmfBEr6cGA/${_.image}/public`}
                      className="h-56 w-full mb-4 bg-slate-300"
                    />
                    <h3 className="text-gray-700 -mb-1">{_.name}</h3>
                    <span className="text-sm font-medium text-gray-900">
                      1,260,000 원
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx?.params?.id) {
    return {
      props: {},
    };
  }

  const { id } = ctx.params;

  const product = await client.product.findUnique({
    where: {
      id: +(id as string),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  const terms = product?.name.split(' ').map((word) => ({
    name: {
      contains: word,
    },
  }));

  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
  });

  // const isLike = Boolean(
  //   await client.favorite.findFirst({
  //     where: {
  //       productId: +(id as string),
  //       userId: req.session.user?.id,
  //     },
  //     select: {
  //       id: true,
  //     },
  //   })
  // );

  const isLike = false;

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
      isLike,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default ItemDetail;
