import React from 'react';
import Link from 'next/link';
import { cls } from '../libs/client/utils';
import { useRouter } from 'next/router';
import LayoutTitle from './layout-title';
import GroundNavBar from './GroundNavBar';
import Head from 'next/head';
import { BiSolidChevronLeft } from 'react-icons/bi';

interface LayoutProps {
  title?: string;
  canGoBack?: boolean;
  hasTabBar?: boolean;
  children: React.ReactNode;
}

export default function Layout({
  title: pTitle,
  canGoBack,
  hasTabBar,
  children,
}: LayoutProps) {
  const router = useRouter();
  const onClick = () => {
    router.back();
  };
  const title = `${pTitle} | 화재장터`;

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="w-full h-12 max-w-xl justify-center text-lg px-10 font-medium fixed border-b top-0 flex items-center z-10">
        {canGoBack ? (
          <button onClick={onClick} className="absolute left-4">
            <BiSolidChevronLeft />
          </button>
        ) : null}
        {pTitle && <LayoutTitle canGoBack={canGoBack}>{pTitle}</LayoutTitle>}
      </div>
      <div className={cls('pt-12', hasTabBar ? 'pb-24' : '')}>{children}</div>
      {hasTabBar && <GroundNavBar />}
    </div>
  );
}
