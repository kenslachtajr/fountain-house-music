'use client';

import { useEffect, useState } from 'react';

// A timestamped ring buffer written to localStorage on every relevant
// event. In-memory-only debug state (the snapshot below) is lost the
// instant iOS suspends or reloads a locked page - which is exactly the
// scenario we need to inspect - so this persists across that boundary and
// can be read back after unlocking to reconstruct what actually happened
// leading up to a stall.
const EVENT_LOG_KEY = 'media-session-event-log';
const MAX_LOG_ENTRIES = 200;

export function logMediaEvent(event: string) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(EVENT_LOG_KEY);
    const log: string[] = raw ? JSON.parse(raw) : [];
    log.push(`${new Date().toISOString()} ${event}`);
    if (log.length > MAX_LOG_ENTRIES)
      log.splice(0, log.length - MAX_LOG_ENTRIES);
    localStorage.setItem(EVENT_LOG_KEY, JSON.stringify(log));
  } catch (_) {}
}

export function readMediaEventLog(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(EVENT_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

export function clearMediaEventLog() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(EVENT_LOG_KEY);
}

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
// unreliable to pair with this project's target devices. A home-screen PWA
// icon is a separate storage context from Safari though (no shared
// localStorage/cookies even for the same site), so ?debug=media set via
// Safari's address bar never reaches the installed app - toggleDebugMode
// below is the way to enable it directly inside that context, no URL
// access needed.
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

export function toggleDebugMode() {
  if (typeof window === 'undefined') return;
  const next = localStorage.getItem('media-session-debug') !== '1';
  if (next) {
    localStorage.setItem('media-session-debug', '1');
  } else {
    localStorage.removeItem('media-session-debug');
  }
  notify();
}

export function isDebugModeOn(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('media-session-debug') === '1';
}

export function MediaSessionDebugOverlay() {
  const [enabled, setEnabled] = useState(false);
  const [, setTick] = useState(0);
  const [showLog, setShowLog] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  useEffect(() => {
    setEnabled(isDebugEnabled());
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (!enabled) return null;

  const log = readMediaEventLog();

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
        maxHeight: '60vh',
        overflowY: 'auto',
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
      <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={() => setShowLog((v) => !v)}
          style={{
            color: '#0ff',
            background: 'none',
            border: '1px solid #0ff',
            borderRadius: 4,
            padding: '2px 6px',
            fontSize: '10px',
          }}
        >
          {showLog ? 'hide log' : `show log (${log.length})`}
        </button>
        <button
          type="button"
          onClick={() => {
            clearMediaEventLog();
            setTick((t) => t + 1);
          }}
          style={{
            color: '#f66',
            background: 'none',
            border: '1px solid #f66',
            borderRadius: 4,
            padding: '2px 6px',
            fontSize: '10px',
          }}
        >
          clear log
        </button>
        <button
          type="button"
          onClick={async () => {
            const text = log.join('\n');
            try {
              await navigator.clipboard.writeText(text);
              setCopyStatus('copied!');
            } catch {
              setCopyStatus('copy failed, use text box below');
            }
            setTimeout(() => setCopyStatus(null), 2000);
          }}
          style={{
            color: '#ff0',
            background: 'none',
            border: '1px solid #ff0',
            borderRadius: 4,
            padding: '2px 6px',
            fontSize: '10px',
          }}
        >
          copy log
        </button>
      </div>
      {copyStatus && <div style={{ color: '#ff0' }}>{copyStatus}</div>}
      {showLog && (
        <div
          style={{ marginTop: 6, borderTop: '1px solid #333', paddingTop: 6 }}
        >
          {/* A plain <textarea> is the most reliable way to get this text off
              an iOS device: tap inside it, "Select All" from the popup menu,
              then Copy - works even if the Clipboard API above is blocked or
              unavailable in this PWA context. */}
          <textarea
            readOnly
            value={log.slice().reverse().join('\n')}
            style={{
              width: '100%',
              height: '120px',
              background: '#111',
              color: '#0f0',
              fontFamily: 'monospace',
              fontSize: '10px',
              border: '1px solid #333',
              borderRadius: 4,
            }}
            onFocus={(e) => e.currentTarget.select()}
          />
        </div>
      )}
    </div>
  );
}
