import React, { useState, useEffect, JSX } from 'react';
import './MarketPrices.css';
import { useNavigate } from 'react-router';

interface PriceData {
    [ticker: string]: number;
}

interface MarketPricesResponse {
    Prices?: PriceData;
}

const API_URL = 'https://localhost:7250/api/Price/GetAllPrices';

function MarketPrices(): JSX.Element {
    const [data, setData] = useState < PriceData > ({});
    const [prevData, setPrevData] = useState < PriceData > ({});
    const [error, setError] = useState < string | null > (null);
    const [lastUpdated, setLastUpdated] = useState < Date | null > (null);

    const navigate = useNavigate();

    const handleRowClick = (ticker: string): void => {
        navigate(`/details/${ticker}`);
    };

    const fetchData = async (): Promise<void> => {
        const TIMEOUT_DURATION = 1000;
        const controller = new AbortController();
        const signal = controller.signal;

        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

        try {
            const response = await fetch(API_URL, { signal });
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: MarketPricesResponse = await response.json();
            const newPrices = result.Prices || {};

            const hasChanged = JSON.stringify(newPrices) !== JSON.stringify(data);

            if (hasChanged) {
                setPrevData(data);
                setData(newPrices);
            }

            setLastUpdated(new Date());
            setError(null);

        } catch (e: unknown) {
            clearTimeout(timeoutId);
            if (e instanceof Error) {
                if (e.name === 'AbortError') {
                    setError(`Request timed out after ${TIMEOUT_DURATION / 1000} seconds.`);
                } else {
                    setError(e.message);
                }
                console.error("Fetch error:", e);
            }
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 5000);
        return () => clearInterval(intervalId);
    }, [data]);

    const getPriceChange = (code: string, currentPrice: number): JSX.Element | null => {
        const previousPrice = prevData[code];
        if (previousPrice === undefined) return null;

        const diff = currentPrice - previousPrice;
        const colorClass = diff === 0 ? '' : diff > 0 ? 'price-up' : 'price-down';
        const sign = diff > 0 ? '+' : '';

        return (
            <span>
                (<span className={colorClass}>
                    {sign}{diff.toFixed(2)}
                </span>)
            </span>
        );
    };

    return (
        <section className="prices-section">
            <h2>Live Market Prices</h2>
            {lastUpdated && <p>Last updated: {lastUpdated.toLocaleTimeString()}</p>}
            {error && (
                <div>
                    <div className="error-message">Error getting latest prices</div>
                    <div className="retry-message">{error} - Automatic retry...</div>
                </div>
            )}
            <table className="prices-table">
                <thead>
                    <tr>
                        <th>Ticker</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data).map(([code, price], index) => (
                        <tr
                            key={code}
                            className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                            onClick={() => handleRowClick(code)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td className="ticker-column">{code}</td>
                            <td className="price-column">
                                ${price.toFixed(2)} {getPriceChange(code, price)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default MarketPrices;
