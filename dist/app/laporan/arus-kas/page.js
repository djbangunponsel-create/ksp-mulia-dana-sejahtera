"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LaporanArusKasPage;
const report_page_1 = __importDefault(require("@/components/report-page"));
async function LaporanArusKasPage({ searchParams }) {
    const params = await searchParams;
    const [reportResponse, kspResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/laporan/arus-kas`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/pengaturan-ksp`),
    ]);
    const reportData = await reportResponse.json();
    const kspData = await kspResponse.json();
    return <report_page_1.default title="Arus Kas" reportData={reportData.report} ksp={kspData.data}/>;
}
//# sourceMappingURL=page.js.map