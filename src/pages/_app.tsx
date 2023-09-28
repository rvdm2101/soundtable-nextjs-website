import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import './globals.scss';
import './index.scss';

export default function App({
  Component,
  pageProps,
}: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
