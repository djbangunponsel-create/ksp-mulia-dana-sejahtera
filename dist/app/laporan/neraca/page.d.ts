interface LaporanNeracaPageProps {
    searchParams: Promise<{
        [key: string]: string | undefined;
    }>;
}
export default function LaporanNeracaPage({ searchParams }: LaporanNeracaPageProps): Promise<any>;
export {};
