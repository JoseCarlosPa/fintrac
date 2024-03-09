"use client"
import React, {useCallback, useEffect, useState} from "react";
import {ImSpinner2} from "react-icons/im";
import {FcGoogle} from "react-icons/fc";
import {GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword} from "firebase/auth";
import {collection, doc, getDocs, setDoc} from "@firebase/firestore";
import {auth, db} from "@/firebase";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
const Register = () => {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [authing, setAuthing] = useState(false)

  const router = useRouter()

  const userCollectionsRef = collection(db, 'users')

  useEffect(() => {
    auth.onAuthStateChanged(function(user) {
      if (user) {
        setAuthing(true)
        router.push('/home')
      }
    });
  }, [router]);

  const signInWithGoogle = async () => {
    setAuthing(true)
    signInWithPopup(auth, new GoogleAuthProvider()).then(async userCredential => {
      const user = userCredential.user
      const data = await getDocs(userCollectionsRef)
      const emails = data.docs.map((doc) => ({...doc.data()}))
      if (emails.find(email => email.email === user.email)) {
        router.push('/home')
      } else {
        await setDoc(doc(db, 'users', user.uid), {id: user.uid, email: user.email, currencies: ['USD','CAD'],mainCurrency: 'MXN'})
      }
    }).catch(error => {
      console.error(error)
      toast.error(error.message)
      setAuthing(false)
    })
  }

  const handleRegister = useCallback((event:any) => {
    event.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    createUserWithEmailAndPassword(auth,email,password).then(async (userCredential) => {
      const user = userCredential.user
      await setDoc(doc(db,'users',user.uid),{id: user.uid, email: user.email,currencies: ['USD','CAD'],mainCurrency: 'MXN'})
      router.push('/dashboard')
    }).catch((error)=>{
      console.error(error)
      toast.error(error.message)
    })

  },[auth, email, password, userCollectionsRef])

  return (
    <div className="bg-white rounded-lg">
      <div className="container flex flex-col mx-auto bg-white rounded-lg md:py-0 py-12 my-5">
        <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
          <div className="flex items-center justify-center w-full lg:p-12">
            <div className="flex items-center xl:p-10">
              <form onSubmit={handleRegister} className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl">
                <h3 className="mb-3 text-4xl font-extrabold text-dark-gray-900">Registrate con Google</h3>
                <p className="mb-4 text-gray-700">Ingresa tu correo y contraseña</p>
                <button
                  type={"button"}
                  disabled={authing}
                  onClick={signInWithGoogle}
                  className="cursor-pointer flex items-center justify-center w-full py-4 mb-6  font-medium transition duration-300 rounded-2xl text-gray-900 bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:ring-gray-300">
                  {authing ? <ImSpinner2 className="animate-spin w-6 h-6 text-black"/> : <>
                    <FcGoogle className="mr-2 my-auto"/>
                    Iniciar con Google</>}

                </button>
                <div className="flex items-center mb-3">
                  <hr className="h-0 border-b border-solid border-gray-500 grow"/>
                  <p className="mx-4 text-gray-600">o</p>
                  <hr className="h-0 border-b border-solid border-gray-500 grow"/>
                </div>
                <label className="mb-2 text-sm text-start text-gray-900">Correo*</label>
                <input id="email" type="email" placeholder="mail@loopple.com"
                       onChange={(event) => setEmail(event.target.value)}
                       className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-gray-400 mb-7 placeholder:text-gray-700 bg-gray-200 text-dark-gray-900 rounded-2xl"/>
                <label className="mb-2 text-sm text-start text-gray-900">Contraseña*</label>
                <input id="password" type="password" placeholder="Enter a password"
                       onChange={(event) => setPassword(event.target.value)}
                       className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-gray-400 placeholder:text-gray-700 bg-gray-200 text-dark-gray-900 rounded-2xl"/>
                <label className="mb-2 text-sm text-start text-gray-900">Confirmar contraseña*</label>
                <input id="password" type="password" placeholder="Enter a password"
                       onChange={(event) => setConfirmPassword(event.target.value)}
                       className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-gray-400 placeholder:text-gray-700 bg-gray-200 text-dark-gray-900 rounded-2xl"/>

                <button
                  type={"submit"}
                  className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-gray-800 focus:ring-4 focus:ring-purple-blue-100 bg-black">Registrarse
                </button>
                <p className="text-sm leading-relaxed text-gray-900">Ya tienes una cuenta? <a href="/login"
                                                                                              className="font-bold text-gray-700">Inicia
                  sesion</a></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;