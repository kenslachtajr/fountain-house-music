# Draft: Replace Howler.js with Persistent Audio Element

## Requirements (confirmed)
- iOS lock screen: songs must auto-advance AND auto-play when screen locked
- All existing functionality must be preserved (play, pause, seek, volume, next, previous)
- MediaSession API integration must continue working
- Native Capacitor media session support must continue working
- Service worker audio caching must continue working

## Technical Decisions
- Replace react-use-audio-player + Howler.js with a single persistent `<audio>` element
- Change song by setting `.src` on the same element instead of creating new ones
- This preserves iOS audio activation chain across song transitions

## Current Architecture
- `AudioPlayerProvider` (react-use-audio-player) wraps the app in providers.tsx
- `UnifiedAudioProvider` wraps react-use-audio-player, exposing: load, play, pause, stop, seek, getPosition, isPlaying, duration, volume, setVolume
- `useUnifiedAudio()` consumed by: player.tsx, player-controls.tsx, player-settings.tsx, player-time-label.tsx, use-audio-time.tsx, player.store.ts
- `useAudioPlayerContext()` consumed directly by: media-item.tsx, album-content.tsx, artist-content.tsx (only for `isPlaying`)
- player.tsx handles: song loading, MediaSession, native media session, seek slider
- Volume uses Howler.volume() globally

## Consumers of useUnifiedAudio (the interface to preserve)
1. player.tsx: load, seek, play, pause, isPlaying, setVolume
2. player-controls.tsx: getPosition, seek, pause, isPlaying, play
3. player-settings.tsx: setVolume, volume
4. player-time-label.tsx: duration, getPosition
5. use-audio-time.tsx: getPosition
6. player.store.ts: stop

## Consumers of useAudioPlayerContext (direct Howler access)
1. media-item.tsx: isPlaying
2. album-content.tsx: isPlaying
3. artist-content.tsx: isPlaying
These only use `isPlaying` — easy to migrate to useUnifiedAudio

## Scope Boundaries
- INCLUDE: Replace audio engine, preserve all existing player functionality
- EXCLUDE: No UI changes, no new features, no changes to store logic

## Open Questions
- None — scope is clear
