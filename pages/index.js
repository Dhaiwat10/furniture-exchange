import { Auth } from '@supabase/ui';
import { useCallback, useEffect, useState } from 'react';
import { Card } from '../components';
import { getListingImages, getListings } from './api/listings';
import { getSaved } from './api/save';
import { search } from './api/search'

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
