"use client"
import {useState} from "react";
import * as XLSX from 'xlsx';

type AmortizationRow = {
  month: number;
  monthlyPayment: number;
  principalPayment: number;
  interestPayment: number;
  remainingBalance: number;
}

const AmortizationTablePage = () => {
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [loanTerm, setLoanTerm] = useState<number>(0);
  const [amortizationTable, setAmortizationTable] = useState<AmortizationRow[]>([]);
  const [showDownload, setShowDownload] = useState<boolean>(false);
  const handleCalculate = () => {
    const rate = (interestRate / 100)/12;
    const monthlyPayment = (loanAmount * rate) / (1 - (1/( Math.pow(1 + rate, loanTerm))));

    const table: AmortizationRow[] = [];
    let remainingBalance = loanAmount;

    for (let i = 1; i <= loanTerm; i++) {
      const interestPayment = remainingBalance * rate;
      const principalPayment = monthlyPayment - interestPayment;

      remainingBalance -= principalPayment;

      table.push({
        month: i,
        monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
        principalPayment: parseFloat(principalPayment.toFixed(2)),
        interestPayment: parseFloat(interestPayment.toFixed(2)),
        remainingBalance: parseFloat(remainingBalance.toFixed(2))
      });
    }

    setShowDownload(true);
    setAmortizationTable(table);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(amortizationTable);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Amortization Table');
    XLSX.writeFile(wb, 'amortization_table.xlsx');
  };

  return (
    <div className="flex flex-col ">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Calculadora de Amortización</h2>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Préstamo
              (Cantidad):</label>
            <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(parseFloat(e.target.value))}
                   className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tasa de Interés
              (%):</label>
            <input type="number" value={interestRate} onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                   className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div className="col-span-12 md:col-span-4 ">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Término del Préstamo
              (Meses):</label>
            <input type="number" value={loanTerm} onChange={(e) => setLoanTerm(parseFloat(e.target.value))}
                   className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4  my-4">

          <button onClick={handleCalculate}
                  className="w-full bg-gray-900 rounded text-white">
            Calcular
          </button>

          {showDownload &&
              <button onClick={exportToExcel}
                      className="w-full bg-gray-900 rounded text-white">
                  Exportar a Excel
              </button>
          }
        </div>

        <div className="flex flex-row w-full overflow-x-auto">
          <table className="mt-4 w-full border-collapse ">
            <thead>
            <tr>
              <th className="border border-gray-400 text-center py-2">Mes</th>
              <th className="border border-gray-400 px-2 py-2">Pago Mensual</th>
              <th className="border border-gray-400 px-2 py-2">Pago de Interés</th>
              <th className="border border-gray-400 px-2 py-2">Pago de Principal</th>
              <th className="border border-gray-400 px-2 py-2">Saldo Restante</th>
            </tr>
            </thead>
            <tbody>
            {amortizationTable.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-400 px-2 py-2">{row.month}</td>
                <td className="border border-gray-400 px-2 py-2">{(row.monthlyPayment).toLocaleString('es-MX', {
                  style: "currency", currency: "MXN"
                })}</td>
                <td className="border border-gray-400 px-2 py-2">{(row.interestPayment).toLocaleString('es-MX', {
                  style: "currency", currency: "MXN"
                })}</td>
                <td className="border border-gray-400 px-2 py-2">{(row.principalPayment).toLocaleString('es-MX', {
                  style: "currency", currency: "MXN"
                })}</td>
                <td className="border border-gray-400 px-2 py-2">{(row.remainingBalance).toLocaleString('es-MX', {
                  style: "currency", currency: "MXN"
                })}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>

  );
}

export default AmortizationTablePage;