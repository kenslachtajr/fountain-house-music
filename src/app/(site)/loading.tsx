'use client';

import { BounceLoader } from 'react-spinners';

import { Box } from '~/components/ui/legacy/box';

const Loading = () => {
  return (
    <Box className="flex h-full items-center justify-center">
  <BounceLoader color="#0096FF" size={40} />
    </Box>
  );
};

export default Loading;
