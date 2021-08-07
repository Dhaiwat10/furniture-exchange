import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { getListingImages, getListings } from '../api/listings';
import { createComment, getComments } from '../api/comment';
import { Auth, Button, Input, Typography } from '@supabase/ui';
import { Card } from '../../components/Card';
import { getSaved, save } from '../api/save';

const Listing = ({ listings }) => {
  const { user } = Auth.useUser();
  const router = useRouter();
  const id = router.query.id;

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [formState, setFormState] = useState('IDLE');
  const [savedListings, setSavedListing] = useState([]);

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

    let oldComments = listings.filter((listing) => listing.id === id)[0]
      .comment_ids;

    if (oldComments && oldComments.length > 0) {
      oldComments = [
        ...listings.filter((listing) => listing.id === id)[0].comment_ids,
      ];
    }

    const comment = {
      parent_listing_id: id,
      created_by: user.email,
      content: newComment,
    };

    const { data } = await createComment(
      comment,
      oldComments && oldComments.length > 0 ? oldComments : []
    );
    console.log('data from comment uploading: ', data);
    setFormState('SUCCESS');
    setNewComment('');
    fetchComments();
  };

  const fetchSaved = useCallback(async () => {
    const { data, error } = await getSaved(user.email);
    if (error) {
      console.log('Error fetch savedListing: '.error);
      return;
    }

    if (data) {
      console.log('data from fetchSaved: ', data);
      setSavedListing(data);
    }
  }, [user.email]);

  useEffect(() => {
    fetchSaved();
  }, [user.email, fetchSaved]);

  return (
    <div>
      {listings
        .filter((listing) => listing.id === id)
        .map((listing) => {
          console.log('listing: ', listing);
          return (
            <Card
              listing={{
                ...listing,
                isSaved: savedListings.includes(listing.id),
              }}
              key={listing.id}
            />
          );
        })}

      <hr className="mt-8" />

      <div className="text-xl mt-4 font-semibold">Comments</div>
      {comments.comments &&
        (comments.comments.length === 0 ? (
          <Typography.Text type="secondary">
            This listing has no comments yet.
          </Typography.Text>
        ) : (
          comments.comments.map((comment) => {
            return (
              <div
                style={{ borderWidth: '1px' }}
                className="my-2 text-lg rounded-md p-4 border-black border-opacity-20"
                key={comment.id}
              >
                <Typography.Text>{comment.content}</Typography.Text>
                <br />
                <Typography.Text type="secondary">
                  — {comment.created_by.split('@')[0]}
                </Typography.Text>
              </div>
            );
          })
        ))}
      <Input.TextArea
        disabled={formState === 'LOADING'}
        value={newComment}
        className="mt-8"
        onChange={(e) => setNewComment(e.target.value)}
        label="Interested? Add a comment"
      />
      <Button
        disabled={newComment === ''}
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
