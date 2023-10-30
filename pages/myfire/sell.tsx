import type { NextPage } from 'next';
import Layout from '@/components/layout';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { cls } from '@/libs/client/utils';
import { ProductStatus } from '@/interface/ProductKind';
import MainProducts from '@/components/MainProducts';
import { ProductWithCount } from '@/interface/Product';

interface ProductListResponse {
  result: boolean;
  data: ProductWithCount[];
}

const Sell: NextPage = () => {
  const { data, isLoading } = useSWR<ProductListResponse>(`/api/product/user/`);

  const [list0, setList0] = useState<ProductWithCount[]>([]);
  const [list1, setList1] = useState<ProductWithCount[]>([]);
  const [list2, setList2] = useState<ProductWithCount[]>([]);

  const [tab, setTab] = useState(0);

  useEffect(() => {
    const list0: ProductWithCount[] = [];
    const list1: ProductWithCount[] = [];
    const list2: ProductWithCount[] = [];
    if (data) {
      data.data.forEach((_) => {
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
    <Layout title="판매내역" canGoBack>
      <div className="">
        <div className="tabs flex text-sm">
          <a
            className={cls(`tab tab-bordered tab-lg flex-1 mt text-sm`, tab === 0 ? 'tab-active' : '')}
            onClick={() => setTab(0)}
          >
            판매중 {list0.length ? list0.length : ''}
          </a>
          <a
            className={cls(`tab tab-bordered tab-lg flex-1 mt text-sm`, tab === 1 ? 'tab-active' : '')}
            onClick={() => setTab(1)}
          >
            거래완료 {list1.length ? list1.length : ''}
          </a>
          <a
            className={cls(`tab tab-bordered tab-lg flex-1 mt text-sm`, tab === 2 ? 'tab-active' : '')}
            onClick={() => setTab(2)}
          >
            숨김 {list2.length ? list2.length : ''}
          </a>
        </div>
        {tab === 0 && <MainProducts products={list0} />}
        {tab === 1 && <MainProducts products={list1} />}
        {tab === 2 && <MainProducts products={list2} />}
      </div>
      <div></div>
    </Layout>
  );
};

export default Sell;
