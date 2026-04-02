'use client';

import { BounceLoader } from 'react-spinners';

import { Box } from '~/components/ui/legacy/box';
import { useTheme } from '~/features/layout/components/theme-context';

const Loading = () => {
  const { primaryColor } = useTheme();
  
  return (
    <Box className="flex h-full items-center justify-center">
      <BounceLoader color={primaryColor} size={40} />
    </Box>
  );
};

export default Loading;
