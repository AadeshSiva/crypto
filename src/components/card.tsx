import { useEffect, useState } from "react";
import { IoIosTrendingUp, IoIosTrendingDown } from "react-icons/io";

// img
import btc from '/btc.svg'
import eth from '/eth.svg'
import doge from '/dodge.svg'

// bg
import btcbg from '/btcbg.svg'
import ethbg from '/ethbg.svg'
import dogebg from '/dogebg.svg'

interface CardProps {
    index: number;
}

export default function Card({ index }: CardProps) {
    const [coinData, setCoinData] = useState<any[]>([]);

    const coins = [
        {
            id: 'bitcoin',
            name: 'Bitcoin',
            img: btc,
            bg: btcbg
        },
        {
            id: 'ethereum',
            name: 'Ethereum',
            img: eth,
            bg: ethbg,
        },
        {
            id: 'dogecoin',
            name: 'Doge',
            img: doge,
            bg: dogebg,
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr',
                    {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                            'x-cg-demo-api-key': import.meta.env.VITE_CG_API_KEY
                        }
                    }
                );
                const data = await res.json();
                setCoinData(data);
            } catch (err) {
                console.error("API fetch error:", err);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);


    const coin = coins[index];
    const live = coinData.find((item) => item.id === coin.id);

    const price = live?.current_price?.toLocaleString('hi-IN', {
        style: 'currency',
        currency: 'INR',

    });

    const priceChange = live?.price_change_percentage_24h ?? 0;
    const isUp = priceChange >= 0;

    return (
        <main className="p-5 bg-gradient-to-tr relative from-blue-700 to-blue-100 rounded-xl w-90 aspect-square flex flex-col justify-end overflow-hidden">
            <img src={coin.bg} alt="bg" className="absolute right-0 bottom-[10%] opacity-30 rotate-20 w-[80%]" />
            <img src={coin.img} alt="coin" className="w-[4em] pb-2 pl-1 z-10" />
            <p className="text-[1.7em] leading-[1em] text-white font-[400] z-10">{coin.name}</p>
            <h1 className="leading-[1.2em] p-0 text-[2.1rem] font-[300] text-white z-10">
                {price ?? "Loading..."}
            </h1>
            <p className="pl-2 text-white flex items-center gap-1 z-10">
                {isUp ? (
                    <IoIosTrendingUp className="text-green-300" size={20} />
                ) : (
                    <IoIosTrendingDown className="text-red-500" size={20} />
                )}
                {Math.abs(priceChange).toFixed(2)}% {isUp ? "growth" : "drop"} in last 24 hours.
            </p>
        </main>
    );
}
