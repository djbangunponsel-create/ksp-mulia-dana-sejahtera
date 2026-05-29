interface LaporanArusKasPageProps {
    searchParams: Promise<{
        [key: string]: string | undefined;
    }>;
}
export default function LaporanArusKasPage({ searchParams }: LaporanArusKasPageProps): Promise<any>;
export {};
