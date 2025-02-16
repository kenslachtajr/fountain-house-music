import { z } from 'zod';

export type Album = z.infer<typeof albumSchema>;
export type Song = z.infer<typeof songsSchema>;
export type AlbumSongs = z.infer<typeof albumSongsSchema>;

export const albumSchema = z.object({
  author: z.string().nullable(),
  created_at: z.string(),
  id: z.string(),
  image_path: z.string().nullable(),
  name: z.string(),
  release_date: z.string().nullable(),
});

export const songsSchema = z.object({
  album: z.string().nullable(),
  album_id: z.string().nullable(),
  author: z.string().nullable(),
  created_at: z.string(),
  duration: z.number().nullable(),
  id: z.string(),
  image_path: z.string().nullable(),
  song_path: z.string().nullable(),
  title: z.string().nullable(),
  user_id: z.string().nullable(),
});

export const albumSongsSchema = z.object({
  author: z.string().nullable(),
  created_at: z.string(),
  id: z.string(),
  image_path: z.string().nullable(),
  name: z.string(),
  release_date: z.string().nullable(),
  songs: z.array(songsSchema),
});
