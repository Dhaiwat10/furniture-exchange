import { Auth } from '@supabase/ui';
import { useCallback, useEffect, useState } from 'react';
import { Card } from '../components';
import { getListingImages, getListings } from './api/listings';
import { getSaved } from './api/save';

export default function Home({ listings }) {
  const { user } = Auth.useUser();
  const [savedListings, setSavedListing] = useState([]);

  useEffect(() => {
    console.log('savedListings: ', savedListings)
    console.log('listings: ', listings)
  }, [savedListings, listings])

  const fetchSaved = useCallback(async () => {
    getSaved(user.email)
      .then((res) => {
        console.log('fetchSaved response: ', res.data);
        setSavedListing(res.data[0].listing_ids);
      })
      .catch((err) => console.log('error fetching saved Listing: ', err));
  }, [user.email]);

  useEffect(() => {
    fetchSaved();
  }, [user.email, fetchSaved]);

  return (
    <div>
      <div className="mx-auto grid lg:grid-cols-2 flex-col gap-6 my-6">
        {listings.map((listing) => (
          <Card
            listing={{...listing, isSaved: savedListings.includes(listing.id)}}
            key={listing.id}
          />
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
