import { Auth, Card as SupabaseCard, Button } from '@supabase/ui';
import { useRouter } from 'next/dist/client/router';
import { useState, useEffect } from 'react';
import { statusUpdate } from '../pages/api/listings';
import { Active, InActive } from './Status';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';

export const Card = ({ listing }) => {
  const { user } = Auth.useUser();
  const [statusLoading, setStatusLoading] = useState('IDLE');

  // console.log('listing from nested route: ', listing);
  const router = useRouter();

  const nestedRoute = router.pathname === '/listing/[id]' ? true : false;

  const changeStatus = async () => {
    setStatusLoading('LOADING');
    const { data, error } = await statusUpdate(listing.id, listing.status);

    console.log('data from statuusUpdate: ', data);

    if (error) {
      console.log('Error while updating status: ', error);
      setStatusLoading('ERROR');
      return;
    }

    if (data) {
      listing.status = data[0].status;
    }
    setStatusLoading('IDLE');
  };

  return (
    <div
    // onClick={() => {
    //   if (nestedRoute) {
    //     return;
    //   }
    //   router.push(`listing/${listing.id}`);
    // }}
    >
      <SupabaseCard
        className={`${!nestedRoute && 'cursor-pointer'}`}
        title={`Created by ${listing.created_by}`}
        cover={[
          listing.images.length == 1 ? (
            <img
              onClick={() => {
                if (nestedRoute) {
                  return;
                }
                router.push(`listing/${listing.id}`);
              }}
              style={{ height: '300px', objectFit: 'contain' }}
              key={listing.images[0]}
              src={listing.images[0]}
              alt="Cover"
            />
          ) : (
            <Carousel
              showThumbs={false}
              dynamicHeight={false}
              infiniteLoop={true}
              autoPlay={true}
              showStatus={false}
            >
              {listing.images.map((image, index) => (
                <div
                  onClick={() => {
                    if (nestedRoute) {
                      return;
                    }
                    router.push(`listing/${listing.id}`);
                  }}
                  style={{
                    height: '300px',
                    objectFit: 'contain',
                  }}
                  key={index}
                >
                  <img
                    style={{ height: '100%', width: 'auto' }}
                    src={image}
                    alt="cover"
                  />
                </div>
              ))}
            </Carousel>
          ),
        ]}
      >
        <div className="flex justify-between">
          <SupabaseCard.Meta
            title={`${listing.from_city} - ${listing.to_city}`}
            description="Description"
          />
          <div className="flex items-center">
            <div>{listing.status === 'ACTIVE' ? <Active /> : <InActive />}</div>
            {nestedRoute && listing.created_by === user.email && (
              <Button
                style={{ backgroundColor: '#4b4c4d', color: '#fff' }}
                size="medium"
                type="default"
                disabled={statusLoading === 'LOADING'}
                onClick={changeStatus}
                className={`${
                  listing.status === 'ACTIVE' ? 'bg-red-500' : 'bg-green-500'
                } ${
                  statusLoading === 'LOADING' && 'cursor-not-allowed'
                } font-semibold border-2 border-gray-600 rounded-md ml-4 p-2 text-white`}
              >
                Mark as {listing.status === 'ACTIVE' ? 'CLOSE' : 'OPEN'}
              </Button>
            )}
          </div>
        </div>
      </SupabaseCard>
    </div>
  );
};
