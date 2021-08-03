import { Card } from '../components';
import { getListingImages, getListings } from './api/listings';

export default function Home({ listings }) {
  return (
    <div>
      <div className="grid grid-cols-2 flex-col gap-6 mt-6">
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
