import { LOCAL_STORAGE_KEYS } from "@core/constants";
import { atom } from "jotai";
import atomWithImprovedStorage, { getItem } from './utils/atomWithImprovedStorage';

interface Blossom {
    id: number;
    startX: string;
    offsetX: number;
    delay: string;
    duration: string;
    size: number;
}

export const showBackGroundAtom = atomWithImprovedStorage<boolean>(
    LOCAL_STORAGE_KEYS.showBackGround,
    getItem(LOCAL_STORAGE_KEYS.showBackGround, false));
export const blossomsAtom = atom<Blossom[]>([]);