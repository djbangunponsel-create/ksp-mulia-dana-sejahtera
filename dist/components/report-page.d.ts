interface ReportPageProps {
    title: string;
    reportData: any;
    ksp?: {
        nama?: string;
        badan_hukum?: string;
        alamat?: string;
        email?: string;
        telepon?: string;
    };
}
export default function ReportPage({ title, reportData, ksp }: ReportPageProps): any;
export {};
