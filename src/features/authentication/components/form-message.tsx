import { useSearchParams } from 'next/navigation';

export type Message =
  | { success: string }
  | { error: string }
  | { error_description: string }
  | { message: string };

export function FormMessage() {
  const searchParams = useSearchParams();
  const message = [...searchParams.entries()].reduce(
    (acc: Message, entry: [string, string]) => {
      const [key, value] = entry as [keyof Message, string];
      acc[key] = value as keyof Message;
      return acc;
    },
    {} as Message,
  );

  return (
    <div className="flex flex-col w-full max-w-md gap-2 text-sm">
      {'success' in message && (
        <div className="px-4 border-l-2 text-foreground border-foreground">
          {decodeURIComponent(message.success)}
        </div>
      )}
      {'error' in message && (
        <div className="px-4 border-l-2 text-destructive-foreground border-destructive-foreground">
          {decodeURIComponent(message.error)}
        </div>
      )}
      {'error_description' in message && (
        <div className="px-4 border-l-2 text-destructive-foreground border-destructive-foreground">
          {decodeURIComponent(message.error_description)}
        </div>
      )}
      {'message' in message && (
        <div className="px-4 border-l-2 text-foreground">
          {decodeURIComponent(message.message)}
        </div>
      )}
    </div>
  );
}
