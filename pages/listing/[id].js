import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { getListingImages, getListings } from '../api/listings';
import { createComment, getComments } from '../api/comment';
import { Auth, Button, Input } from '@supabase/ui';
import { Card } from '../../components/Card';

const Listing = ({ listings }) => {
  const { user } = Auth.useUser();
  const router = useRouter();
  const id = router.query.id;

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [formState, setFormState] = useState('IDLE');

  const fetchComments = useCallback(async () => {
    const comments = getComments(id)
      .then((res) => {
        console.log('response from fetching comments', res);
        setComments(res);
      })
      .catch((err) => console.log('Error fetching comments: ', err));
    return comments;
  }, [id]);

  useEffect(() => {
    fetchComments();
  }, [id, fetchComments]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormState('LOADING');

    const oldComments = [...listings.filter(listing => listing.id === id)[0].comment_ids]

    const comment = {
      parent_listing_id: id,
      created_by: user.email,
      content: newComment,
    };

    const { data } = await createComment(comment, oldComments);
    console.log('data from comment uploading: ', data);
    setNewComment('');
    setFormState('SUCCESS');
    fetchComments();
  };

  return (
    <div>
      {listings
        .filter((listing) => listing.id === id)
        .map((listing) => {
          console.log('listing: ', listing);
          return <Card listing={listing} key={listing.id} />;
        })}

      <div className="text-xl mt-4 font-semibold">Comments</div>
      {comments.comments && (comments.comments.length === 0 ? (
        <div className="my-2 text-lg border-2 rounded-md p-2 border-black border-opacity-5">
          This listing has no comments yet.
        </div>
      ) : (
        comments.comments.map((comment) => {
          return (
            <div
              className="my-2 text-lg border-2 rounded-md p-2 border-black border-opacity-5"
              key={comment.id}
            >
              {comment.content}
            </div>
          );
        })
      ))}

      {formState === 'LOADING' ? (
        <div className="border-2 text-xl font-medium rounded-md p-2 mt-8 mb-4">
          LOADING ...
        </div>
      ) : (
        <Input.TextArea
          className="mt-8"
          onChange={(e) => setNewComment(e.target.value)}
          label="Create Comment"
        />
      )}
      <Button
        className="mt-4"
        size="large"
        onClick={onSubmit}
        loading={formState === 'LOADING'}
      >
        Create
      </Button>
    </div>
  );
};

export default Listing;

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
