// pages/tools/fix-durations.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '~/utils/supabase/client';
import { Button } from '~/components/ui/legacy/button';

const supabase = createClient();

const getDurationFromUrl = (url: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.src = url;

    audio.onloadedmetadata = () => {
      resolve(Math.round(audio.duration));
    };

    audio.onerror = () => {
      reject('Failed to load audio');
    };
  });
};

interface SongToUpdate {
  id: string;
  url: string;
  duration: number;
  song_order: number;
}

export default function FixDurationsPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [pendingUpdates, setPendingUpdates] = useState<SongToUpdate[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);

  const fetchDurations = async () => {
    setIsRunning(true);
    setLog([]);
    setPendingUpdates([]);

    const { data: songs, error } = await supabase
      .from('songs')
      .select('id, song_path')
      .is('duration', null);

    if (error) {
      setLog((prev) => [...prev, `Error fetching songs: ${error.message}`]);
      setIsRunning(false);
      return;
    }

    const updates: SongToUpdate[] = [];

    for (const song of songs) {
      if (!song.song_path) {
        setLog((prev) => [...prev, `No song path for song ${song.id}`]);
        continue;
      }

      const { data: songUrlData } = supabase.storage
        .from('songs')
        .getPublicUrl(song.song_path);

      const url = songUrlData?.publicUrl;

      if (!url) {
        setLog((prev) => [...prev, `No public URL for song ${song.id}`]);
        continue;
      }

      try {
        const duration = await getDurationFromUrl(url);
        updates.push({ id: song.id, url, duration });
        setLog((prev) => [...prev, `Ready: ${song.id} — ${duration}s`]);
      } catch (err) {
        setLog((prev) => [...prev, `❌ Failed ${song.id}: ${err}`]);
      }
    }

    setPendingUpdates(updates);
    setIsRunning(false);
    setIsConfirming(true);
  };

  const applyUpdates = async () => {
    setIsRunning(true);
    setLog((prev) => [...prev, 'Applying updates...']);

    for (const update of pendingUpdates) {
      try {
        await supabase.from('songs').update({ duration: update.duration }).eq('id', update.id);
        setLog((prev) => [...prev, `✅ Updated ${update.id} with ${update.duration}s`]);
      } catch (err) {
        setLog((prev) => [...prev, `❌ Failed to update ${update.id}: ${err}`]);
      }
    }

    setIsConfirming(false);
    setPendingUpdates([]);
    setIsRunning(false);
    setLog((prev) => [...prev, 'Done!']);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Fix Missing Durations</h1>
      {!isConfirming ? (
        <Button disabled={isRunning} onClick={fetchDurations}>
          {isRunning ? 'Running...' : 'Start Scan'}
        </Button>
      ) : (
        <Button disabled={isRunning} onClick={applyUpdates}>
          {isRunning ? 'Applying...' : 'Confirm & Apply Updates'}
        </Button>
      )}
      <div className="mt-6 max-h-96 overflow-y-auto border p-4 rounded bg-gray-800 text-white text-sm">
        {log.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );
}
