import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Chart() {
    const [chartData, setChartData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBitcoinINRData = async () => {
            try {
                const now = Math.floor(Date.now() / 1000); 
                const sixHoursAgo = now - 6 * 60 * 60;

                const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=inr&from=${sixHoursAgo}&to=${now}&precision=2`;

                const response = await fetch(url);
                if (!response.ok) throw new Error(`API returned ${response.status}`);

                const data = await response.json();

                if (!data?.prices || !Array.isArray(data.prices)) {
                    throw new Error("Invalid response structure");
                }

                const labels = data.prices.map((point: [number, number]) =>
                    new Date(point[0]).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                );

                const prices = data.prices.map((point: [number, number]) => point[1]);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "Bitcoin Price",
                            data: prices,
                            borderColor: "rgba(0, 60, 255, 1)",
                            tension: 0.4,
                            pointRadius: 0,
                        },
                    ],
                });

                setLoading(false);
            } catch (err: any) {
                console.error("Error fetching data:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchBitcoinINRData();
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" as const },
            title: { display: true, text: "Bitcoin Price Last 6 Hours" },
        },
        scales: {
            x: { ticks: { maxTicksLimit: 12 } },
        },
    };

    return (
        <main className="h-screen w-screen fixed z-12 bg-blue-200 flex items-center justify-center p-4">
            {loading ? (
                <p className="text-xl">Loading...</p>
            ) : error ? (
                <p className="text-xl text-red-600">Error: {error}</p>
            ) : (
                <div className="w-full max-w-4xl bg-white p-6 rounded-xl ">
                    <Line data={chartData} options={options} />
                </div>
            )}
        </main>
    );
}
