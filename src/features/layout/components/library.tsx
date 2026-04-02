'use client';

import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { RxCaretDown, RxCaretRight } from 'react-icons/rx';
import { TbPlaylist } from 'react-icons/tb';
import { MediaItem } from '~/components/media-item';
import { useAuthenticationDialogActions } from '~/features/authentication/stores/use-authentication-dialog';

import { useCurrentUserSelect } from '~/features/layout/store/current-user';
import { useUploadDialogActions } from '~/features/upload/stores/use-upload-modal';
import { Song } from '~/types/types';

interface LibraryProps {
  songs: Song[];
}

export function Library({ songs }: LibraryProps) {
  const [expanded, setExpanded] = useState(false);
  const userDetails = useCurrentUserSelect();
  const { openDialogTo: openAuthenticationDialogTo } =
    useAuthenticationDialogActions();
  const { openDialog: openUploadDialog } = useUploadDialogActions();

  const onClick = () => {
    if (!userDetails) {
      return openAuthenticationDialogTo('sign-in');
    }

    return openUploadDialog();
  };

  if (!userDetails || userDetails.role === 'user') return null;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-x-2 transition hover:text-white"
        >
          {expanded ? (
            <RxCaretDown className="text-neutral-400" size={22} />
          ) : (
            <RxCaretRight className="text-neutral-400" size={22} />
          )}
          <TbPlaylist className="text-neutral-400" size={26} />
          <p className="text-md font-medium text-neutral-400">Your Library</p>
        </button>
        {expanded && (
          <AiOutlinePlus
            onClick={onClick}
            size={20}
            className="cursor-pointer text-neutral-400 transition hover:text-white"
          />
        )}
      </div>
      {expanded && (
        <div className="mt-4 flex flex-col gap-y-2 px-3">
          {songs.map((item) => (
            <MediaItem key={item.id} data={item} />
          ))}
        </div>
      )}
    </div>
  );
}
