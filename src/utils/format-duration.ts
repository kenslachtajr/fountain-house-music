export function formatDuration(
  seconds: number,
  readable: boolean = false,
): string {
  if (seconds < 0) return '--';

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (!readable) {
    if (seconds < 60)
      return `0:${remainingSeconds.toString().padStart(2, '0')}`;
    if (seconds < 3600)
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    if (seconds < 86400)
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    return `${days}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hr${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? 's' : ''}`);
  if (remainingSeconds > 0)
    parts.push(`${remainingSeconds} sec${remainingSeconds > 1 ? 's' : ''}`);

  return parts.length > 0 ? parts.join(' ') : '0 secs';
}
