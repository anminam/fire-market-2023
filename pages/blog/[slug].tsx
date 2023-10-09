import Layout from '@/components/layout';
import { readdirSync } from 'fs';
import matter from 'gray-matter';
import { GetStaticProps, NextPage, NextPageContext } from 'next';
import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

interface IPost {
  post: string;
  info: {
    title: string;
    date: string;
    category: string;
  };
}
const Post: NextPage<IPost> = ({ post, info }) => {
  return (
    <Layout title="블로그" canGoBack={true}>
      <div>{info.title}</div>
      <div>{info.date}</div>
      <div>{info.category}</div>
      <div
        className={'blog-post-content'}
        dangerouslySetInnerHTML={{ __html: post }}
      />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { content, data } = matter.read(`./posts/${context.params?.slug}.md`);
  const { value } = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(content);

  return {
    props: {
      post: value,
      info: data,
    },
  };
};

export function getStaticPaths() {
  const files = readdirSync('./posts').map((file) => {
    const [name] = file.split('.');
    return { params: { slug: name } };
  });

  return {
    paths: [],
    fallback: 'blocking',
  };
}
export default Post;
