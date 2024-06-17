import { atom } from "recoil";

export const authAtom = atom({
  key: "auth",
  default: {
    token: "",
    username: "",
  },
});
