export function NowPlayingIcon() {
  return (
    <span className="inline-block align-middle mr-2">
      <span className="relative flex h-4 w-4">
        <span className="animate-pulse bg-green-500 w-1 h-4 mx-[1px] rounded-sm" />
        <span className="animate-bounce bg-green-400 w-1 h-3 mx-[1px] rounded-sm" style={{ animationDelay: '0.1s' }} />
        <span className="animate-pulse bg-green-300 w-1 h-2 mx-[1px] rounded-sm" style={{ animationDelay: '0.2s' }} />
      </span>
    </span>
  );
}