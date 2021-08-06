import { Auth, Typography } from '@supabase/ui';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Card } from '../components';
import { getListingImages, getListings } from './api/listings';
import { getSaved } from './api/save';
import { search } from './api/search';

export default function Home({ listings }) {
  const { user } = Auth.useUser();
  const [savedListings, setSavedListing] = useState([]);

  useEffect(() => {
    console.log('savedListings: ', savedListings);
    console.log('listings: ', listings);
  }, [savedListings, listings]);

  const fetchSaved = useCallback(async () => {
    const { data, error } = await getSaved(user.email);
    if (error) {
      console.log('Error fetch savedListing: '.error);
      return;
    }

    if (data) {
      console.log('data from fetchSaved: ', data);
      setSavedListing(data);
    }
  }, [user.email]);

  useEffect(() => {
    fetchSaved();
  }, [user.email, fetchSaved]);

  if (listings.length < 1) {
    return (
      <div className="py-12 text-center">
        <Typography.Text type="secondary" style={{ fontSize: '5rem' }}>
          :(
        </Typography.Text>

        <div className="mt-6">
          <Typography.Text type="secondary">
            We couldnt find anything for you.
          </Typography.Text>
        </div>

        <Link passHref href="/new">
          <Typography.Link target="_self" className="underline">
            Create a listing instead
          </Typography.Link>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto grid lg:grid-cols-2 flex-col gap-6 my-6">
        {listings.map((listing) => (
          <Card
            listing={{
              ...listing,
              isSaved: savedListings.includes(listing.id),
            }}
            key={listing.id}
          />
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const fromQuery = context.query.from || '';
  const toQuery = context.query.to || '';
  const { data: listings, error } = await search(fromQuery, toQuery);
  // const { listings } = await getListings();

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
