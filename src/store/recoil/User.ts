import {atom} from "recoil";
import { recoilPersist } from 'recoil-persist'
import {User} from "@/types/User";

const { persistAtom } = recoilPersist()
export const UserState = atom<User | null>({
  key: 'User',
  default: null,
  effects_UNSTABLE: [persistAtom]
});
