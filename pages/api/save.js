import { createClient } from '@supabase/supabase-js';
import { projectUrl } from '../../constants';

const supabase = createClient(projectUrl, process.env.NEXT_PUBLIC_SUPABASE_KEY);

export async function save(listingId, userEmail) {
  const { data: savedListing, error: fetchSavedError } = await supabase
    .from('saved')
    .select()
    .eq('user_email', userEmail);

  console.log('Logging savedListing: ', savedListing);

  if (savedListing[0] && savedListing[0].listing_ids) {
    const newListingIds = [...savedListing[0].listing_ids];

    if (newListingIds.includes(listingId)) {
      newListingIds.splice(newListingIds.indexOf(listingId), 1);
    } else {
      newListingIds.push(listingId);
    }
    const { data: savedData, error: saveError } = await supabase
      .from('saved')
      .update({ listing_ids: newListingIds })
      .eq('user_email', userEmail);

    if (saveError) {
      console.log('Error while updating save data', saveError);
    }
    return { savedData, saveError };
  }

  const { data: savedData, error: saveError } = await supabase
    .from('saved')
    .insert([{ user_email: userEmail, listing_ids: [listingId] }]);

  return { savedData, saveError };
}

export async function getSaved(userEmail) {
  const { data, error } = await supabase
    .from('saved')
    .select('*')
    .eq('user_email', userEmail);

  return {
    data: data[0] && data[0].listing_ids ? data[0].listing_ids : [],
    error,
  };
}
