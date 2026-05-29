interface LaporanPHUPageProps {
    searchParams: Promise<{
        [key: string]: string | undefined;
    }>;
}
export default function LaporanPHUPage({ searchParams }: LaporanPHUPageProps): Promise<any>;
export {};
