import { Auth } from '@supabase/ui';
import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '../components';
import { getListingImages, getListings } from './api/listings';
import { getSaved } from './api/save';

const Saved = ({ listings }) => {
  const { user } = Auth.useUser();
  const [savedListings, setSavedListing] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = useCallback(async () => {
    setLoading(true);
    const { data, error } = await getSaved(user.email);
    if (error) {
      console.log('Error fetch savedListing: '.error);
      setLoading(false);
      return;
    }

    if (data) {
      console.log('data from fetchSaved: ', data);
      setSavedListing(data);
      setLoading(false);
    }
  }, [user.email]);

  useEffect(() => {
    fetchSaved();
  }, [user.email, fetchSaved]);

  if (!savedListings || savedListings.length === 0) {
    return (
      <div className="my-2 text-xl font-medium text-center p-2 px-3 border-black ">
        {loading ? 'Loading...' : "You don't have any saved listings yet."}
      </div>
    );
  }

  return (
    <div className="mx-auto grid lg:grid-cols-2 flex-col gap-6">
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
