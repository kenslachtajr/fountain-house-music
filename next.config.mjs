import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'src/sw.ts',
  swDest: 'public/sw.js',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['mrtwlhupmsqkvymzxfzv.supabase.co'],
  },
};

export default withSerwist(nextConfig);
