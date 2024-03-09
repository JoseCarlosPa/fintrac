import {useEffect, useState} from "react";
import {auth} from "@/firebase";
import {User as FirebaseUser, onAuthStateChanged} from "@firebase/auth";

const useUserState = () => {

  const [user, setUser] = useState<FirebaseUser | null | false>(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) =>  setUser(user));
  }, []);

  return user;
}

export default useUserState