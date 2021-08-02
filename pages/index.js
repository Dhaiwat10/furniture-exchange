import { Typography, Button, Auth } from '@supabase/ui';
import { useContext } from 'react';
import { Card, SupabaseContext } from '../components';
import { getListingImages, getListings } from './api/listings';

export default function Home({ listings }) {
  const { user } = Auth.useUser();
  const supabaseClient = useContext(SupabaseContext);

  console.log(listings);

  return (
    <div>
      <Typography.Text>Signed in: {user.email}</Typography.Text>

      <Button block onClick={() => supabaseClient.auth.signOut()}>
        Sign out
      </Button>

      <div className="grid flex-col gap-6 mt-6">
        {listings.map((listing) => (
          <Card listing={listing} key={listing.id} />
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { listings } = await getListings();

  for await (let listing of listings) {
    const images = await getListingImages(listing);
    listing.images = images;
  }

  console.log(listings);

  return {
    props: {
      listings,
    },
  };
}
