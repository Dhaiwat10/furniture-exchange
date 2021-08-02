import Head from 'next/head';

export const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Furniture Exchange</title>
        <meta name="description" content="Supabase hackathon entry" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
    </>
  );
};
