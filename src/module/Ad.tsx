import type { FC } from "react";
import React, { useEffect, useRef } from "react";

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
    console.log("[PROSPER] add", placementName, "alias:", alias);
    console.log("[PROSPER] window.__VM exists:", !!window.__VM);
    console.log("[PROSPER] isHSorVideoSlider:", isHSorVideoSlider());
    console.log("[PROSPER] elRef.current:", elRef.current);

    const handleAdManagerPush = (admanager: any, scope: any) => {
      console.log("[PROSPER] handleAdManagerPush called for", placementName);
      console.log("[PROSPER] scope.Config:", scope.Config);

      try {
        if (placementName === "vertical_sticky") {
          console.log("[PROSPER] Displaying vertical_sticky");
          scope.Config.verticalSticky().display();
        } else {
          const displayTarget = isHSorVideoSlider() ? { body: true } : elRef.current;
          console.log("[PROSPER] Getting placement config for", placementName, "displayTarget:", displayTarget);

          const placementConfig = scope.Config.get(placementName, alias);
          console.log("[PROSPER] placementConfig:", placementConfig);

          placement = placementConfig.display(displayTarget);
          console.log("[PROSPER] placement displayed:", placement);
        }
      } catch (error) {
        console.error("[PROSPER] Error displaying ad:", error);
      }
    };

    const handleUnmount = (admanager: any, scope: any) => {
      console.log("[PROSPER] removed", placementName);

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
