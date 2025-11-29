import React, { useEffect } from "react";

const ProsperNewSession = () => {
    useEffect(() => {
        console.log("[PROSPER] ProsperNewSession initializing...");
        window.__VM = window.__VM || [];
        console.log("[PROSPER] window.__VM initialized:", window.__VM);

        window.__VM.push((admanager: any, scope: any) => {
            console.log("[PROSPER] New page session callback executed");
            console.log("[PROSPER] admanager:", admanager);
            console.log("[PROSPER] scope:", scope);
            console.log("[PROSPER] scope.Instances:", scope.Instances);

            if (scope.Instances && scope.Instances.pageManager) {
                scope.Instances.pageManager.on(
                    "navigated",
                    () => {
                        // this should trigger everytime you consider the content a "new page"
                        scope.Instances.pageManager.newPageSession(false);
                        console.log("[PROSPER] New page session triggered");
                    },
                    false,
                );
                console.log("[PROSPER] Page manager navigation listener registered");
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
