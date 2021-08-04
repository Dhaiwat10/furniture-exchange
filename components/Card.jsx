import { Card as SupabaseCard } from '@supabase/ui';
import { useRouter } from 'next/dist/client/router';

export const Card = ({ listing }) => {
  console.log('listing from nested route: ', listing);
  const router = useRouter();
  return (
    <div
      onClick={() => {
        router.push(`listing/${listing.id}`);
      }}
    >
      <SupabaseCard
        className="cursor-pointer"
        title={`Created by ${listing.created_by}`}
        cover={[
          <img
            style={{ height: '200px', objectFit: 'contain' }}
            key={listing.images[0]}
            src={listing.images[0]}
            alt="Cover"
          />,
        ]}
      >
        <SupabaseCard.Meta
          title={`${listing.from_city} - ${listing.to_city}`}
          description="Description"
        />
      </SupabaseCard>
    </div>
  );
};
