import { createClient } from '@supabase/supabase-js';
import { projectUrl } from '../../constants';

const supabase = createClient(projectUrl, process.env.NEXT_PUBLIC_SUPABASE_KEY);

export async function createComment(comment, oldComments) {
  try {
    const { error, data } = await supabase.from('comments').insert([comment]);

    console.log('new Comment: ', data);

    oldComments.push(data[0].id);

    await supabase
      .from('listings')
      .update({ comment_ids: oldComments })
      .eq('id', comment.parent_listing_id);

    return { error, data };
  } catch (err) {
    console.log('error while creating comment', err);
    return { error: err };
  }
}

export async function getComments(listingId) {
  const { data: comments, error } = await supabase
    .from('comments')
    .select('*')
    .eq('parent_listing_id', listingId);

  if (error) {
    return {
      success: false,
      error,
      comments: [],
    };
  }

  return {
    success: true,
    error: null,
    comments,
  };
}
