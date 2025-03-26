import { atom } from "jotai";

interface Blossom {
    id: number;
    startX: string;
    offsetX: number;
    delay: string;
    duration: string;
}

export const showBackGroundAtom = atom<boolean>(false);
export const blossomsAtom = atom<Blossom[]>([]);