import React, { useEffect } from "react";

const ProsperNewSession = () => {
    useEffect(() => {
        window.__VM = window.__VM || [];
        window.__VM.push((admanager: any, scope: any) => {
            console.log("[PROSPER] New page session. out");
            scope.Instances.pageManager.on(
                "navigated",
                () => {
                    // this should trigger everytime you consider the content a "new page"
                    scope.Instances.pageManager.newPageSession(false);
                    console.log("[PROSPER] New page session.");
                },
                false,
            );
        });

        return () => { };
    }, []);
    return null;
};

export default ProsperNewSession;
