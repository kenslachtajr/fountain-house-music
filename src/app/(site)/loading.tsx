'use client';

import { BounceLoader } from 'react-spinners';

import { Box } from '~/components/ui/legacy/box';

const Loading = () => {
  return (
    <Box className="flex items-center justify-center h-full">
      <BounceLoader color="#22c55e" size={40} />
    </Box>
  );
};

export default Loading;
