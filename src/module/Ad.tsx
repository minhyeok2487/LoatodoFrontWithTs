/* eslint-disable no-restricted-globals */
import type { FC } from "react";
import { useEffect, useRef } from "react";

type AdProps = {
  placementName: string;
  alias?: string;
};

const Ad: FC<AdProps> = ({ placementName, alias }) => {
  const elRef = useRef(null);

  const isHSorVideoSlider = () => {
    const validPlacements = [
      "horizontal_sticky",
      "mobile_horizontal_sticky",
      "video_slider",
    ];
    return validPlacements.includes(placementName);
  };

  useEffect(() => {
    let placement: any;

    const handleAdManagerPush = (admanager: any, scope: any) => {
      if (placementName === "vertical_sticky") {
        scope.Config.verticalSticky().display();
      } else {
        placement = scope.Config.get(placementName, alias).display(
          isHSorVideoSlider() ? { body: true } : elRef.current
        );
      }
    };

    const handleUnmount = (admanager: any, scope: any) => {
      if (placementName === "vertical_sticky") {
        scope.Config.verticalSticky().destroy();
      } else if (placement) {
        admanager.removePlacement(placement.instance());
      }
    };

    self.__VM.push(handleAdManagerPush);

    return () => {
      self.__VM.push(handleUnmount);
    };
  }, []);
  return <div ref={elRef} />;
};

export default Ad;
/* eslint-enable no-restricted-globals */
