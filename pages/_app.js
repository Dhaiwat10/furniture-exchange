import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import { Auth } from '@supabase/ui';
import { createClient } from '@supabase/supabase-js';
import { SupabaseContext } from '..//components';

const supabase = createClient(
  'https://kbqgrjcttayfuajohvny.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const Container = ({ children, Component, pageProps }) => {
  const { user } = Auth.useUser();

  if (user)
    return (
      <SupabaseContext.Provider value={supabase}>
        <Component {...pageProps} />
      </SupabaseContext.Provider>
    );

  if (!user) {
    return <>{children}</>;
  }
};

function MyApp({ Component, pageProps }) {
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <Container Component={Component} pageProps={pageProps}>
        <Auth supabaseClient={supabase} />
      </Container>
    </Auth.UserContextProvider>
  );
}

export default MyApp;
