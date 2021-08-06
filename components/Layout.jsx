import Head from 'next/head';
import { Typography, Button, Auth, Input } from '@supabase/ui';
import { useContext, useEffect, useState } from 'react';
import { SupabaseContext } from './SupabaseContext';
import { useRouter } from 'next/dist/client/router';

const TopBar = () => {
  const { user } = Auth.useUser();
  const supabaseClient = useContext(SupabaseContext);

  useEffect(() => {
    console.log(supabaseClient);
  }, [supabaseClient]);

  return (
    <div className="mb-12 my-6 flex items-center">
      <div className="flex gap-4">
        <Typography.Link href="/" target="_self">
          Home
        </Typography.Link>
        <Typography.Link href="/new" target="_self">
          New
        </Typography.Link>
        <Typography.Link href="/saved" target="_self">
          Saved
        </Typography.Link>
      </div>

      {user && (
        <div className="flex items-center ml-auto mr-0 gap-4">
          <Typography.Text>{user && user.email}</Typography.Text>
          <Button
            style={{ marginLeft: 'auto', marginRight: 0 }}
            onClick={() => supabaseClient.auth.signOut()}
          >
            Sign out
          </Button>
        </div>
      )}
    </div>
  );
};

const SearchBar = () => {
  const router = useRouter();

  const [fromQuery, setFromQuery] = useState(router.query.from || '');
  const [toQuery, setToQuery] = useState(router.query.to || '');

  const onClick = () => {
    router.push(`/?from=${fromQuery}&to=${toQuery}`);
  };

  const onKeyPress = (e) => {
    console.log(e.key, e.ctrlKey);
    if ((e.key === 'Enter' && e.ctrlKey) || e.key === 'Enter') {
      onClick();
    }
  };

  return (
    <div onKeyUp={onKeyPress} className="flex items-center gap-6">
      <Input
        value={fromQuery}
        onChange={(e) => setFromQuery(e.target.value)}
        placeholder="I'm moving from..."
      />
      <Input
        value={toQuery}
        onChange={(e) => setToQuery(e.target.value)}
        placeholder="I'm moving to..."
      />
      <Button onClick={onClick}>Search</Button>
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
        <SearchBar />
        {children}
      </main>
    </>
  );
};
