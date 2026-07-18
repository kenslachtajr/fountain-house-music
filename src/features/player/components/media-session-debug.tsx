'use client';

import { useEffect, useState } from 'react';

interface DebugSnapshot {
  hasMediaSession: boolean;
  metadataTitle: string | null;
  metadataArtwork: string | null;
  playbackState: string | null;
  isPlaying: boolean;
  duration: number;
  position: number;
  lastAction: string | null;
  lastError: string | null;
  updatedAt: string;
}

let snapshot: DebugSnapshot = {
  hasMediaSession: false,
  metadataTitle: null,
  metadataArtwork: null,
  playbackState: null,
  isPlaying: false,
  duration: 0,
  position: 0,
  lastAction: null,
  lastError: null,
  updatedAt: '',
};

const listeners = new Set<() => void>();

function notify() {
  snapshot = { ...snapshot, updatedAt: new Date().toLocaleTimeString() };
  listeners.forEach((cb) => cb());
}

export function recordMediaSessionAction(action: string) {
  snapshot.lastAction = action;
  notify();
}

export function recordMediaSessionError(error: string) {
  snapshot.lastError = error;
  notify();
}

export function recordMediaSessionState(
  update: Partial<
    Pick<
      DebugSnapshot,
      | 'hasMediaSession'
      | 'metadataTitle'
      | 'metadataArtwork'
      | 'playbackState'
      | 'isPlaying'
      | 'duration'
      | 'position'
    >
  >,
) {
  snapshot = { ...snapshot, ...update };
  notify();
}

// Enabled via ?debug=media on the URL, persisted to localStorage so it
// survives navigation without needing Safari Web Inspector, which has been
// unreliable to pair with this project's target devices.
function isDebugEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get('debug') === 'media') {
    localStorage.setItem('media-session-debug', '1');
  }
  if (params.get('debug') === 'off') {
    localStorage.removeItem('media-session-debug');
  }
  return localStorage.getItem('media-session-debug') === '1';
}

export function MediaSessionDebugOverlay() {
  const [enabled, setEnabled] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    setEnabled(isDebugEnabled());
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '96px',
        left: '8px',
        right: '8px',
        zIndex: 9999,
        background: 'rgba(0,0,0,0.9)',
        color: '#0f0',
        fontFamily: 'monospace',
        fontSize: '10px',
        lineHeight: 1.4,
        padding: '8px',
        borderRadius: '8px',
        maxHeight: '35vh',
        overflowY: 'auto',
        pointerEvents: 'none',
      }}
    >
      <div>mediaSession API: {String(snapshot.hasMediaSession)}</div>
      <div>title: {snapshot.metadataTitle ?? '—'}</div>
      <div>artwork: {snapshot.metadataArtwork ?? '—'}</div>
      <div>playbackState: {snapshot.playbackState ?? '—'}</div>
      <div>isPlaying: {String(snapshot.isPlaying)}</div>
      <div>
        position/duration: {snapshot.position.toFixed(1)} /{' '}
        {snapshot.duration.toFixed(1)}
      </div>
      <div>last action: {snapshot.lastAction ?? '—'}</div>
      <div style={{ color: snapshot.lastError ? '#f66' : '#0f0' }}>
        last error: {snapshot.lastError ?? '—'}
      </div>
      <div>updated: {snapshot.updatedAt}</div>
    </div>
  );
}
