'use client';

import { Box } from '~/components/ui/legacy/box';

const Error = () => {
  return (
    <Box className="flex items-center justify-center h-full">
      <div className="text-neutral-400">Something went wrong.</div>
    </Box>
  );
};

export default Error;
