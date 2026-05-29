"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReportPage;
const ksp_header_1 = require("@/components/ksp-header");
function ReportPage({ title, reportData, ksp }) {
    return (<div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 print:shadow-none print:p-0">
        <div className="no-print mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 print:hidden">
            Cetak Laporan
          </button>
        </div>
        
        <ksp_header_1.KSPHeader {...ksp}/>
        
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">{title}</h3>
          <p className="text-sm text-gray-500 mb-4">Tanggal: {reportData?.date}</p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Keterangan</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Kas</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {reportData?.assets?.kas?.toLocaleString('id-ID') || '0'}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Piutang Diberikan</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {reportData?.assets?.piutang_diberikan?.toLocaleString('id-ID') || '0'}
                  </td>
                </tr>
                <tr className="font-bold bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Total Aktiva</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {reportData?.assets?.total_assets?.toLocaleString('id-ID') || '0'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=report-page.js.map