import { shouldNeverHappen } from '~/utils/should-never-happen';

export const getURL = () => {
  const url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? process?.env?.NEXT_PUBLIC_VERCEL_URL;

  if (!url) {
    return shouldNeverHappen(
      'Neither NEXT_PUBLIC_SITE_URL nor NEXT_PUBLIC_VERCEL_URL is defined',
    );
  }

  const finalUrl = url.includes('http') ? url : `https://${url}`;
  return finalUrl.charAt(finalUrl.length - 1) === '/'
    ? finalUrl
    : `${finalUrl}/`;
};
