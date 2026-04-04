## 2026-04-03 Task: Architecture Decisions
- Keep persistent audio element pattern (module-level `let persistentAudio`) — this is the iOS fix
- Export a useUnifiedAudioIsPlaying() hook or re-export isPlaying from context for the 3 consumer files
- Since audioIsPlaying is unused in all 3 files, simplest approach: just remove the import and destructure line entirely
- Remove react-use-audio-player and @types/howler from package.json after migration complete
