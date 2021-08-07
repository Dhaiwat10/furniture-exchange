import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import { Auth, Typography } from '@supabase/ui';
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
            <div className="justify-center text-center">
              <h1 className="text-4xl font-bold mx-auto inline-block">
                Furniture Exchange 🪑
              </h1>
              <br/>
              <Typography.Text type="secondary">
                Helping people moving same cities find a furniture swap partner.
                Please sign-up/login to continue. <br />
                (and yes thats the most creative name we could come up with)
              </Typography.Text>
            </div>

            <div className="lg:w-6/12 xl:w-6/12 mx-auto">
              <Auth supabaseClient={supabase} />
            </div>
          </Container>
        </Layout>
      </SupabaseContext.Provider>
    </Auth.UserContextProvider>
  );
}

export default MyApp;
