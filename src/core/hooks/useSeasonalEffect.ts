import { useMemo } from 'react';

import CherryBlossom from '@layouts/CherryBlossom';
import FallingLeaves from '@layouts/FallingLeaves';

// Later, you can create and import a Snowfall component
// import Snowfall from '@layouts/Snowfall';

const useSeasonalEffect = () => {
  const seasonalComponent = useMemo(() => {
    const month = new Date().getMonth() + 1; // 1 (Jan) to 12 (Dec)

    // TODO 임시 코드 추후 수정 필요
    // Spring: March, April, May
    if (month >= 3 && month <= 8) {
      return CherryBlossom;
    }

    // Autumn: September, October, November
    if (month >= 9 && month <= 11) {
      return FallingLeaves;
    }

    // Winter: December, January, February
    // if (month === 12 || month === 1 || month === 2) {
    //   return Snowfall;
    // }

    // Summer or other months
    return null;
  }, []);

  return seasonalComponent;
};

export default useSeasonalEffect;
