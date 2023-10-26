import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { SWRConfig } from 'swr';
import { fetcher } from '@/libs/client/fetcher';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher }}>
      <div className="w-full max-w-xl mx-auto">
        <Component {...pageProps} />
      </div>
      {/* <Script strategy="lazyOnload"></Script> */}
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        onLoad={() => {
          // @ts-ignore
          window.fbAsyncInit = function () {
            // @ts-ignore
            FB.init({
              appId: 'your-app-id',
              xfbml: true,
              version: 'v18.0',
            });
          };
        }}
      ></Script>
    </SWRConfig>
  );
}

export default MyApp;
