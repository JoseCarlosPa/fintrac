import axios from "axios";

export const getCurrencies = async (
  baseCurrency: string,
  currency: string
) => {



  try{
    const response = await axios.get(`  https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.NEXT_PUBLIC_CURRENCY_API_KEY}&currencies=${currency}&base_currency=${baseCurrency}`)
    return response.data

  }catch (error) {
    console.log(error)
  }

}