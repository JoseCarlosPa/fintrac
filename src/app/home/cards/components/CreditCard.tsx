import {RiVisaFill} from "react-icons/ri";
import {FaTrashAlt} from "react-icons/fa";
import {MdEdit} from "react-icons/md";

type CreditCardProps = {
  name: string
  number: string
  expiryDate: string
  isVisa: boolean
}
const CreditCard = ({name,number,expiryDate,isVisa}:CreditCardProps) => {
  return (
    <div
      className="flex flex-col justify-around bg-gray-800 p-4 border border-white border-opacity-30 rounded-lg shadow-md max-w-xs mx-auto"
    >
      <div className="flex flex-row items-center justify-between mb-3">
        <input
          className="w-full h-10 border-none outline-none text-sm bg-gray-800 text-white font-semibold caret-orange-500 pl-2 mb-3 flex-grow"
          type="text"
          value={name}
          id="cardName"
          disabled
          placeholder="Full Name"
        />
        <div
          className="flex items-center justify-center relative w-14 h-9 bg-gray-800 border border-white border-opacity-20 rounded-md"
        >
          {isVisa ?
            <RiVisaFill className="text-gray-300 w-6 h-6"/>
            :
            <svg
              className="text-white fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 48 48"
            >
              <path
                fill="#ff9800"
                d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"
              ></path>
              <path
                fill="#d50000"
                d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"
              ></path>
              <path
                fill="#ff3d00"
                d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"
              ></path>
            </svg>
          }

        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <span className="w-full h-10 border-none outline-none text-sm bg-gray-800 text-white font-semibold caret-orange-500 pl-2">
          XXXX XXXX XXXX {number}
        </span>
        <div className="flex flex-row justify-between">
          <input
            className="w-full h-10 border-none outline-none text-sm bg-gray-800 text-white font-semibold caret-orange-500 pl-2"
            type="text"
            name="expiryDate"
            id="expiryDate"
            disabled
            value={expiryDate}
            placeholder="MM/AA"
          />

          <div className="flex flex-row gap-x-4 my-auto mx-auto">
            <MdEdit className="w-7 h-7 md:w-5 md:h-5 text-yellow-400" />
            <FaTrashAlt className="w-7 h-7 md:w-5 md:h-5 text-red-600" />
          </div>

        </div>
      </div>
    </div>

  );
}

export default CreditCard