/* eslint-disable no-restricted-globals */
import { useEffect } from "react";

const ProsperNewSession = () => {
    useEffect(() => {
        self.__VM = self.__VM || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        self.__VM.push((admanager: any, scope: any) => {
            // eslint-disable-next-line no-console
            console.log("[PROSPER] New page session. out");
            scope.Instances.pageManager.on(
                "navigated",
                () => {
                    // this should trigger everytime you consider the content a "new page"
                    scope.Instances.pageManager.newPageSession(false);
                    // eslint-disable-next-line no-console
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
