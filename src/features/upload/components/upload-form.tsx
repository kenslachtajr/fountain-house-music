'use client';

import uniqid from 'uniqid';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '~/components/ui/legacy/button';
import { Input } from '~/components/ui/legacy/input';
import { useCurrentUserSelect } from '~/features/layout/store/current-user';
import { createClient } from '~/utils/supabase/client';
import {
  useIsUploadDialogOpenSelect,
  useUploadDialogActions,
} from '../stores/use-upload-modal';

export function UploadForm() {
  const router = useRouter();
  const supabaseClient = createClient();
  const user = useCurrentUserSelect();
  const isOpen = useIsUploadDialogOpenSelect();
  const { closeDialog } = useUploadDialogActions();

  const [isLoading, setIsLoading] = useState(false);
  const [songs, setSongs] = useState<
    { file: File; title: string; author: string; duration?: number }[]
  >([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { reset } = useForm({
    defaultValues: {},
  });

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = document.createElement('audio');
      audio.preload = 'metadata';

      audio.onloadedmetadata = () => {
        window.URL.revokeObjectURL(audio.src);
        resolve(audio.duration);
      };

      audio.onerror = () => {
        reject(new Error('Error loading audio metadata'));
      };

      audio.src = URL.createObjectURL(file);
    });
  };

  const handleSongFilesChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    const songWithDurations = await Promise.all(
      fileArray.map(async (file) => {
        const duration = await getAudioDuration(file);
        return {
          file,
          title: file.name.replace(/\.[^/.]+$/, ''),
          author: '',
          duration: Math.round(duration),
        };
      })
    );

    setSongs(songWithDurations);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const onSubmit = async () => {
    try {
      if (!user || songs.length === 0 || !imageFile) {
        toast.error('Missing fields');
        return;
      }

      setIsLoading(true);

      // Upload album image once
      const { data: imageData, error: imageError } = await supabaseClient.storage
        .from('images')
        .upload(`album-image-${uniqid()}`, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (imageError) {
        setIsLoading(false);
        return toast.error('Failed image upload');
      }

      // Upload each song and insert metadata
      for (const { file, title, author, duration } of songs) {
        const uniqueID = uniqid();

        const { data: songData, error: songError } = await supabaseClient.storage
          .from('songs')
          .upload(`song-${title}-${uniqueID}`, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (songError) {
          toast.error(`Failed to upload ${title}`);
          continue;
        }

        const { error: insertError } = await supabaseClient
          .from('songs')
          .insert({
            user_id: user.id,
            title,
            author,
            image_path: imageData.path,
            song_path: songData.path,
            duration, // duration in seconds (int4)
          });

        if (insertError) {
          toast.error(`Failed to save metadata for ${title}`);
          continue;
        }
      }

      toast.success('Album uploaded!');
      router.refresh();
      reset();
      setSongs([]);
      setImageFile(null);
      closeDialog();
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) return;
    reset();
    setSongs([]);
    setImageFile(null);
  }, [isOpen, reset]);

  return (<div className="flex flex-col max-h-[90vh]">
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}
    className="flex-1 flex flex-col gap-y-4 overflow-hidden"
  >
    <div>
      <div className="pb-1 font-medium">Select song files</div>
      <Input
        id="songs"
        type="file"
        multiple
        disabled={isLoading}
        accept=".mp3"
        onChange={handleSongFilesChange}
      />
    </div>

    {/* Scrollable song list */}
    <div className="overflow-y-auto flex-1 max-h-[50vh] pr-2 space-y-3 border rounded p-2">
      {songs.map((song, index) => (
        <div key={index} className="border p-2 rounded shadow-sm bg-white">
          <div className="font-medium">{song.file.name}</div>
          <Input
            placeholder="Title"
            value={song.title}
            disabled={isLoading}
            onChange={(e) => {
              const updated = [...songs];
              updated[index].title = e.target.value;
              setSongs(updated);
            }}
            className="my-1"
          />
          <Input
            placeholder="Author"
            value={song.author}
            disabled={isLoading}
            onChange={(e) => {
              const updated = [...songs];
              updated[index].author = e.target.value;
              setSongs(updated);
            }}
          />
          {song.duration !== undefined && (
            <div className="text-sm text-muted-foreground mt-1">
              Duration: {song.duration}s
            </div>
          )}
        </div>
      ))}
    </div>

    <div>
      <div className="pb-1">Select album image</div>
      <Input
        id="image"
        type="file"
        disabled={isLoading}
        accept="image/*"
        onChange={handleImageChange}
      />
    </div>
  </form>

  {/* Submit button always visible at the bottom */}
  <div className="pt-2">
    <Button disabled={isLoading} type="submit" className="w-full" onClick={onSubmit}>
      Upload Album
    </Button>
  </div>
</div>
  );
}
