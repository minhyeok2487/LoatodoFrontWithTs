import React, { useEffect } from "react";

const ProsperNewSession = () => {
    useEffect(() => {
        window.__VM = window.__VM || [];

        window.__VM.push((admanager: any, scope: any) => {

            if (scope.Instances && scope.Instances.pageManager) {
                scope.Instances.pageManager.on(
                    "navigated",
                    () => {
                        // this should trigger everytime you consider the content a "new page"
                        scope.Instances.pageManager.newPageSession(false);
                    },
                    false,
                );
            } else {
                console.error("[PROSPER] scope.Instances.pageManager not available!");
            }
        });

        return () => {
            console.log("[PROSPER] ProsperNewSession unmounting");
        };
    }, []);
    return null;
};

export default ProsperNewSession;
