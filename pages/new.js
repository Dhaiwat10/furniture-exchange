import { Auth, Button, Input, Typography, Alert } from '@supabase/ui';
import { useCallback, useState } from 'react';
import { createListing, uploadImage } from './api/listings';
import { useDropzone } from 'react-dropzone';

export default function Index() {
  const { user } = Auth.useUser();

  const [formData, setFormData] = useState({ from_city: '', to_city: '' });
  const [formState, setFormState] = useState('IDLE');
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormState('LOADING');

    console.log(files);

    const image_file_names = files.map((file, idx) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${idx}.${fileExt}`;
      return fileName;
    });

    const listing = {
      created_by: user.email,
      status: 'ACTIVE',
      image_file_names,
      ...formData,
    };

    const { data } = await createListing(listing);
    const listingId = data[0].id;

    await Promise.all(
      files.map((file, idx) => uploadImage(file, listingId, idx))
    );

    setFormState('SUCCESS');
  };

  const thumbs = (
    <div className="flex gap-4 items-center">
      {files.map((file) => (
        <div key={file.name} className="h-64">
          <img className="rounded-lg" src={file.preview} alt="Image" />
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {formState === 'SUCCESS' ? (
        <div>
          <Alert withIcon title="Success">
            bla bla bla
          </Alert>
        </div>
      ) : (
        <>
          <Typography.Text strong style={{ fontSize: '2rem' }}>
            Create a listing
          </Typography.Text>

          <form className="flex flex-col gap-6 mt-6 w-6/12">
            <div className="flex gap-12">
              <Input
                label="Moving from"
                value={formData.from_city}
                onChange={(e) =>
                  setFormData({ ...formData, from_city: e.target.value })
                }
              />
              <Input
                label="Moving to"
                value={formData.to_city}
                onChange={(e) =>
                  setFormData({ ...formData, to_city: e.target.value })
                }
              />
            </div>

            <Typography.Text>Upload images</Typography.Text>
            <div
              {...getRootProps()}
              className="cursor-pointer p-6 border-2 border-dashed rounded-lg text-center"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag n drop some files here, or click to select files</p>
              )}
            </div>
            <aside>{thumbs}</aside>

            <Button
              size="large"
              onClick={onSubmit}
              loading={formState === 'LOADING'}
            >
              Create
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
