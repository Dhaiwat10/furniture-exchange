import Head from 'next/head';
import { Typography, Button, Auth } from '@supabase/ui';
import { useContext } from 'react';
import { SupabaseContext } from './SupabaseContext';

const TopBar = () => {
  const { user } = Auth.useUser();
  const supabaseClient = useContext(SupabaseContext);

  return (
    <div className="mb-12 my-6 flex items-center">
      <div>
        <Typography.Link href="/" target="_self">
          Home
        </Typography.Link>
      </div>

      <div className="flex items-center ml-auto mr-0 gap-4">
        <Typography.Text>{user && user.email}</Typography.Text>
        <Button
          style={{ marginLeft: 'auto', marginRight: 0 }}
          onClick={() => supabaseClient.auth.signOut()}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
};

export const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Furniture Exchange</title>
        <meta name="description" content="Supabase hackathon entry" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-11/12 sm:w-9/12 mx-auto">
        <TopBar />
        {children}
      </main>
    </>
  );
};
