import Layout from '@/components/layout';
import { useRouter } from 'next/router';

interface IProps {}
const ErrorPage = ({}: IProps) => {
  const router = useRouter();

  const code = router.query.code;
  const message = router.query.message;

  return (
    <Layout title="점검중" isViewTabBar>
      <div className="mx-4 mt-4">
        <h1 className="my-4 text-2xl font-bold">잠시만 기다려주세요</h1>
        <div className="text-sm">{message}</div>
        <div className="text-sm">code: {code}</div>
      </div>
    </Layout>
  );
};

export default ErrorPage;
