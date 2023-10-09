import React from 'react';
import Link from 'next/link';
import { cls } from '../libs/client/utils';
import { useRouter } from 'next/router';
import LayoutTitle from './layout-title';
import GroundNavBar from './GroundNavBar';
import Head from 'next/head';

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
      <div className="bg-white w-full h-12 max-w-xl justify-center text-lg px-10 font-medium fixed text-gray-800 border-b top-0  flex items-center z-10">
        {canGoBack ? (
          <button onClick={onClick} className="absolute left-4">
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
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
        ) : null}
        {pTitle && <LayoutTitle canGoBack={canGoBack}>{pTitle}</LayoutTitle>}
      </div>
      <div className={cls('pt-12', hasTabBar ? 'pb-24' : '')}>{children}</div>
      {hasTabBar && <GroundNavBar />}
    </div>
  );
}
