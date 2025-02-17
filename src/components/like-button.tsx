'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useAuthenticationDialogActions } from '~/features/authentication/stores/use-authentication-dialog';
import { useCurrentUserSelect } from '~/features/layout/store/current-user';
import { createClient } from '~/utils/supabase/client';

interface LikeButtonProps {
  songId: string;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
  const router = useRouter();
  const supabaseClient = createClient();

  const { openDialogTo } = useAuthenticationDialogActions();
  const user = useCurrentUserSelect();

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchData = async () => {
      const { data, error } = await supabaseClient
        .from('liked_songs')
        .select('*')
        .eq('user_id', user.id)
        .eq('song_id', songId)
        .single();

      if (!error && data) {
        setIsLiked(true);
      }
    };

    fetchData();
  }, [songId, supabaseClient, user?.id]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async () => {
    if (!user) {
      return openDialogTo('sign-in');
    }

    if (isLiked) {
      const { error } = await supabaseClient
        .from('liked_songs')
        .delete()
        .eq('user_id', user.id)
        .eq('song_id', songId);

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(false);
      }
    } else {
      const { error } = await supabaseClient.from('liked_songs').insert({
        song_id: songId,
        user_id: user.id,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(true);
        toast.success('Liked!');
      }
    }
    router.refresh();
  };

  return (
    <button onClick={handleLike} className="transition hover:opacity-75">
      <Icon color={isLiked ? '#0096FF' : 'white'} size={25} />
    </button>
  );
};
