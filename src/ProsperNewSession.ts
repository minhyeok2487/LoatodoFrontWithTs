/* eslint-disable no-restricted-globals, @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

const ProsperNewSession = () => {
    useEffect(() => {
        self.__VM = self.__VM || [];
        self.__VM.push((admanager: any, scope: any) => {
            scope.Instances.pageManager.on(
                "navigated",
                () => {
                    scope.Instances.pageManager.newPageSession(false);
                },
                false,
            );
        });

        return () => { };
    }, []);
    return null;
};

export default ProsperNewSession;
