import type { NextPage } from 'next';
import Layout from '@/components/layout';

import useSWR from 'swr';
import useUser from '@/libs/client/useUser';
import { Product } from '@prisma/client';
import { useEffect, useState } from 'react';
import { cls } from '@/libs/client/utils';
import ProductByList from '@/components/ProductByList';
import { ProductStatus } from '@/interface/ProductKind';

interface ProductListResponse {
  result: boolean;
  data: Product[];
}

// interface SellItem {
//   label: string;
//   list: Product[];
// }

// const list: SellItem[] = [
//   { label: '판매중', list: [] },
//   { label: '거래완료', list: [] },
//   { label: '숨김', list: [] },
// ];

const Community: NextPage = () => {
  const { user } = useUser();
  const { data, isLoading } = useSWR<ProductListResponse>(`/api/product/user/`);

  const [list0, setList0] = useState<Product[]>([]);
  const [list1, setList1] = useState<Product[]>([]);
  const [list2, setList2] = useState<Product[]>([]);

  const [tab, setTab] = useState(0);

  useEffect(() => {
    const list0: Product[] = [];
    const list1: Product[] = [];
    const list2: Product[] = [];
    if (data) {
      data.data.forEach(_ => {
        switch (_.statusCd) {
          case ProductStatus.SALE:
          case ProductStatus.RSRV:
            list0.push(_);
            break;
          case ProductStatus.CMPL:
            list1.push(_);
            break;
          case ProductStatus.HIDE:
            list2.push(_);
            break;
        }
      });
    }
    setList0(list0);
    setList1(list1);
    setList2(list2);
  }, [data]);

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
            판매중 {list0.length ? list0.length : ''}
          </a>
          <a
            className={cls(
              `tab tab-bordered tab-lg flex-1 mt text-sm`,
              tab === 1 ? 'tab-active' : ''
            )}
            onClick={() => setTab(1)}
          >
            거래완료 {list1.length ? list1.length : ''}
          </a>
          <a
            className={cls(
              `tab tab-bordered tab-lg flex-1 mt text-sm`,
              tab === 2 ? 'tab-active' : ''
            )}
            onClick={() => setTab(2)}
          >
            숨김 {list2.length ? list2.length : ''}
          </a>
        </div>
        {tab === 0 && <ProductByList list={list0} />}
        {tab === 1 && <ProductByList list={list1} />}
        {tab === 2 && <ProductByList list={list2} />}
      </div>
      <div></div>
    </Layout>
  );
};

export default Community;
