import Layout from '@/components/layout';
import { readFileSync, readdirSync } from 'fs';
import matter from 'gray-matter';
import { NextPage } from 'next';
import Link from 'next/link';

interface Post {
  title: string;
  date: string;
  contents: string;
  slug: string;
}

const Blog: NextPage<{ posts: Post[] }> = ({ posts }) => {
  return (
    <Layout title="블로그">
      <h1>Blog</h1>
      <ul>
        {posts.map((post, index) => (
          <li key={index} className="mb-5">
            <Link href={`/blog/${post.slug}`}>
              <h2>{post.title}</h2>
              <p>{post.date}</p>
              <p>{post.contents}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export async function getStaticProps() {
  const posts = readdirSync('./posts').map((file) => {
    const content = readFileSync(`./posts/${file}`, 'utf8');
    const [slug] = file.split('.');
    return { ...matter(content).data, slug };
  });

  return {
    props: {
      posts: posts,
    },
  };
}

export default Blog;
