import { Card as SupabaseCard } from '@supabase/ui';

export const Card = ({ listing }) => {
  return (
    <SupabaseCard
      className='cursor-pointer'
      title={`Created by ${listing.created_by}`}
      cover={[
        <img
          style={{  height:'200px', objectFit: 'contain' }}
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
  );
};
