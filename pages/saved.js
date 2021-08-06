import { Auth } from '@supabase/ui';
import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '../components';
import { getListingImages, getListings } from './api/listings';
import { getSaved } from './api/save';

const Saved = ({ listings }) => {
  const { user } = Auth.useUser();
  const [savedListings, setSavedListing] = useState([]);

  const fetchSaved = useCallback(async () => {
    getSaved(user.email)
      .then((res) => {
        console.log('fetchSaved response: ', res);
        setSavedListing(res.data[0].listing_ids);
      })
      .catch((err) => console.log('error fetching saved Listing: ', err));
  }, [user.email]);

  useEffect(() => {
    fetchSaved();
  }, [user.email, fetchSaved]);

  if (!savedListings || savedListings.length === 0) {
    return (
      <div className="my-2 text-xl font-medium text-center p-2 px-3 border-black ">
        You dont have any saved listings yet.
      </div>
    );
  }

  return (
    <div className="mx-auto grid lg:grid-cols-2 flex-col gap-6 my-6">
      {listings
        .filter((listing) => savedListings.includes(listing.id))
        .map((listing) => (
          <Card
            listing={{
              ...listing,
              isSaved: savedListings.includes(listing.id),
            }}
            key={listing.id}
          />
        ))}
    </div>
  );
};

export default Saved;

export async function getServerSideProps(context) {
  const { listings } = await getListings();

  for await (let listing of listings) {
    const images = await getListingImages(listing);
    listing.images = images;
  }

  return {
    props: {
      listings,
    },
  };
}
