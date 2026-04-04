## 2026-04-03 Task: Initial Exploration
- The core migration from Howler.js to persistent HTMLAudioElement is ALREADY DONE in use-unified-audio.tsx
- providers.tsx already uses UnifiedAudioProvider (not AudioPlayerProvider)
- Only 3 files still import from react-use-audio-player: media-item.tsx, album-content.tsx, artist-content.tsx
- These 3 files destructure `isPlaying` as `audioIsPlaying` but NEVER USE IT in JSX — only `isCurrent` is used
- The UnifiedAudioContext is created but not exported — need to export useContext hook for isPlaying access
- player.store.ts uses useUnifiedAudio().stop in handleReset
- Package manager is npm (package-lock.json exists, no bun.lockb)
- Build command: next build
- TypeScript check: npx tsc --noEmit (or via next build)

## 2026-04-03 Debug: Audio not playing
- Added debug logging to use-unified-audio.tsx and player.tsx
- Need user to run the app and check console output to diagnose
- Looking for: load() called, metadata loaded, play() called, play() succeeded/failed
