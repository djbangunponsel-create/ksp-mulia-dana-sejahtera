"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KSPHeader = KSPHeader;
function KSPHeader({ nama, badan_hukum, alamat, email, telepon }) {
    if (!nama)
        return null;
    return (<div className="print-area mb-6 text-center border-b-2 border-gray-800 pb-4">
      <h1 className="text-2xl font-bold uppercase">{nama}</h1>
      <p className="text-lg">{badan_hukum}</p>
      <p className="text-sm">{alamat}</p>
      <p className="text-sm">Email: {email} | Telp: {telepon}</p>
    </div>);
}
//# sourceMappingURL=ksp-header.js.map