import React from 'react';
import { useCountUp } from '../hooks/useCountUp';

const AnimatedNumber = ({ value, duration = 2000, decimals = 0, suffix = '', prefix = '' }) => {
  const count = useCountUp(value, duration, 0, true);
  
  const formattedValue = decimals > 0 
    ? count.toFixed(decimals)
    : Math.floor(count);

  return (
    <>
      {prefix}{formattedValue}{suffix}
    </>
  );
};

export default AnimatedNumber;
