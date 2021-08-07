import Head from 'next/head';
import { Typography, Button, Auth, Input } from '@supabase/ui';
import { useContext, useState } from 'react';
import { SupabaseContext } from './SupabaseContext';
import { useRouter } from 'next/dist/client/router';
import NextLink from 'next/link';

const TopBar = () => {
  const { user } = Auth.useUser();
  const supabaseClient = useContext(SupabaseContext);

  return (
    <div className="mb-6 my-6 flex items-center">
      <div className="flex gap-4 sm:gap-6">
        <NextLink href="/">
          <Typography.Link href="/" target="_self">
            Home
          </Typography.Link>
        </NextLink>

        <NextLink href="/new">
          <Typography.Link href="/new" target="_self">
            New
          </Typography.Link>
        </NextLink>

        <NextLink href="/saved">
          <Typography.Link href="/saved" target="_self">
            Saved
          </Typography.Link>
        </NextLink>

        <Typography.Link
          href="https://github.com/dhaiwat10/furniture-exchange#furniture-exchange-x-supabase-%EF%B8%8F"
          target="_blank"
          style={{ color: '#bbb' }}
        >
          Source
        </Typography.Link>
      </div>

      {user && (
        <div className="flex items-center ml-auto mr-0 gap-4">
          {/* <Typography.Text>{user && user.email}</Typography.Text> */}
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
    if ((e.key === 'Enter' && e.ctrlKey) || e.key === 'Enter') {
      onClick();
    }
  };

  return (
    <div
      onKeyUp={onKeyPress}
      className="flex items-center w-screen sm:w-auto gap-6 mx-auto justify-center"
    >
      <Input
        value={fromQuery}
        onChange={(e) => setFromQuery(e.target.value)}
        placeholder="Moving from..."
      />
      <Input
        value={toQuery}
        onChange={(e) => setToQuery(e.target.value)}
        placeholder="Moving to..."
      />
      <Button onClick={onClick}>Search</Button>
    </div>
  );
};

const Link = ({ label, href }) => {
  return (
    <a
      href={href}
      className="underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  );
};

const Footer = () => {
  return (
    <footer
      style={{ left: '50%', transform: 'translateX(-50%)', zIndex: 2000 }}
      className="text-center fixed w-11/12 sm:w-auto bottom-6 bg-black text-white rounded-lg p-4 shadow"
    >
      Made with ❤️ in 🇮🇳 by&nbsp;
      <Link href="https://github.com/dhaiwat10" label="Dhaiwat" />
      ,&nbsp;
      <Link href="https://github.com/nazeeh21" label="Nazeeh" /> &amp;&nbsp;
      <Link href="https://github.com/miralsuthar" label="Miral" />
    </footer>
  );
};

export const Layout = ({ children }) => {
  const { user } = Auth.useUser();

  return (
    <>
      <Head>
        <title>Furniture Exchange 🪑</title>
        <meta name="description" content="Supabase hackathon entry" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-11/12 sm:w-9/12 mx-auto">
        {user && (
          <>
            <TopBar />
            <SearchBar />
            <hr className="mt-6" />
          </>
        )}

        <div style={{ height: '85vh', overflowY: 'scroll' }} className="py-12">
          {children}
        </div>
        <Footer />
      </main>
    </>
  );
};
