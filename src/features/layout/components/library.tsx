'use client';

import { AiOutlinePlus } from 'react-icons/ai';
import { TbPlaylist } from 'react-icons/tb';
import MediaItem from '~/components/MediaItem';

import { useAuthenticationModal } from '~/features/authentication/hooks/use-authentication-dialog';
import { useUploadDialog } from '~/features/upload/hooks/use-upload-modal';
import { useCurrentUserFromStore } from '~/hooks/use-current-user';
import { Song } from '~/types/types';

interface LibraryProps {
  songs: Song[];
}

export function Library({ songs }: LibraryProps) {
  const userDetails = useCurrentUserFromStore();
  const { openDialog: openAuthenticationDialog } = useAuthenticationModal();
  const { openDialog: openUploadDialog } = useUploadDialog();

  const onClick = () => {
    if (!userDetails) {
      return openAuthenticationDialog();
    }

    // TODO: Check for subscription
    return openUploadDialog();
  };

  if (!userDetails || userDetails.role === 'user') return null;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4 ">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist className="text-neutral-400" size={26} />
          <p className="font-medium text-neutral-400 text-md">Your Library</p>
        </div>
        <AiOutlinePlus
          onClick={onClick}
          size={20}
          className="transition cursor-pointer text-neutral-400 hover:text-white"
        />
      </div>
      <div className="flex flex-col px-3 mt-4 gap-y-2">
        {songs.map((item) => (
          <MediaItem key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}
