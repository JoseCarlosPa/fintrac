import CreditCard from "@/app/home/cards/components/CreditCard";

const CreditCards = () => {

  return(
    <div className="flex flex-col">
      <span className="font-bold text-lg">Mis tarjetas</span>
      <div className="grid grid-cols-12 mt-12">
        <div className="col-span-12  md:col-span-4">
          <CreditCard number={'5821'} expiryDate={"12/29"} isVisa={true} name={"HSBC 2Now"} />
        </div>
      </div>

    </div>
  );
}

export default CreditCards