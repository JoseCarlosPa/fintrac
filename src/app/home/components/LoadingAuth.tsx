import {CgSpinnerTwoAlt} from "react-icons/cg";

const LoadingAuth = () => {
  return(
    <div className="w-screen h-screen flex justify-center items-center">
      <CgSpinnerTwoAlt className="w-24 h-24 text-gray-800 rounded-full animate-spin" />
    </div>
  );
}

export default LoadingAuth