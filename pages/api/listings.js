import { createClient } from '@supabase/supabase-js';
import { projectUrl } from '../../constants';

const supabase = createClient(projectUrl, process.env.NEXT_PUBLIC_SUPABASE_KEY);

export async function getListingImages(listing) {
  const fileUrls = [];
  for await (let fileName of listing.image_file_names) {
    const { publicURL } = supabase.storage
      .from('public')
      .getPublicUrl(`${listing.id}/${fileName}`);

    if (publicURL) {
      fileUrls.push(publicURL);
    }
  }
  return fileUrls;
}

export async function getListings() {
  let { data: listings, error } = await supabase.from('listings').select('*');

  if (error) {
    return {
      success: false,
      error,
      listings: [],
    };
  }
  return {
    success: true,
    listings,
    error: null,
  };
}

export async function createListing(listing) {
  const { error, data } = await supabase.from('listings').insert([listing]);
  return { error, data };
}

export async function uploadImage(file, listingId, idx) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${idx}.${fileExt}`;
  const filePath = `${listingId}/${fileName}`;

  let { error: uploadError } = await supabase.storage
    .from('public')
    .upload(filePath, file);

  if (uploadError) {
    return false;
  }

  return true;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const output = await getListings();
    if (!output.success) {
      return res.status(500).json(output);
    }
    res.status(200).json(output);
  }

  if (req.method === 'POST') {
    const output = await createListing(req.body);
    if (output.error) {
      return res.status(500).json(output);
    }
    res.status(200).json(output);
  }
}
