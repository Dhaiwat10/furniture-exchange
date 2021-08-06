import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import { Auth } from '@supabase/ui';
import { createClient } from '@supabase/supabase-js';
import { Layout, SupabaseContext } from '..//components';
import { projectUrl } from '../constants';

const supabase = createClient(projectUrl, process.env.NEXT_PUBLIC_SUPABASE_KEY);

const Container = ({ children, Component, pageProps }) => {
  const { user } = Auth.useUser();

  if (user) {
    console.log(supabase);
    return <Component {...pageProps} />;
  }
  if (!user) {
    return <>{children}</>;
  }
};

function MyApp({ Component, pageProps }) {
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <SupabaseContext.Provider value={supabase}>
        <Layout>
          <Container Component={Component} pageProps={pageProps}>
            <Auth supabaseClient={supabase} />
          </Container>
        </Layout>
      </SupabaseContext.Provider>
    </Auth.UserContextProvider>
  );
}

export default MyApp;
