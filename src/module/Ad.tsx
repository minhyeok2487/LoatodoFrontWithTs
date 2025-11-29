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
      "video",
    ];
    return validPlacements.includes(placementName);
  };

  useEffect(() => {
    let placement: any;

    const handleAdManagerPush = (admanager: any, scope: any) => {
      try {
        if (placementName === "vertical_sticky") {
          scope.Config.verticalSticky().display();
        } else {
          const displayTarget = isHSorVideoSlider()
            ? { body: true }
            : elRef.current;

          const placementConfig = scope.Config.get(placementName, alias);

          placement = placementConfig.display(displayTarget);
        }
      } catch (error) {
        console.error("[PROSPER] Error displaying ad:", error);
      }
    };

    const handleUnmount = (admanager: any, scope: any) => {
      try {
        if (placementName === "vertical_sticky") {
          scope.Config.verticalSticky().destroy();
        } else if (placement) {
          admanager.removePlacement(placement.instance());
        }
      } catch (error) {
        console.error("[PROSPER] Error unmounting ad:", error);
      }
    };

    if (window.__VM) {
      window.__VM.push(handleAdManagerPush);
    } else {
      console.error("[PROSPER] window.__VM is not available!");
    }

    return () => {
      if (window.__VM) {
        window.__VM.push(handleUnmount);
      }
    };
  }, []);

  return <div ref={elRef} />;
};

export default Ad;
