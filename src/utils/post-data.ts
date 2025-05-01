import { Price } from '~/types/types';
import { shouldNeverHappen } from '~/utils/should-never-happen';

export const postData = async ({
  url,
  data,
}: {
  url: string;
  data?: { price: Price };
}) => {
  const res: Response = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    return shouldNeverHappen(
      `API request failed: ${res.status} ${res.statusText}`,
      { url, data, status: res.status },
    );
  }

  return res.json();
};
