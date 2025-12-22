import React, { useState, useEffect, useCallback } from 'react';
import './MarketPrices.css';
import { priceService, type PriceData } from '../services/price.service';
import { useNavigate } from 'react-router';

function MarketPrices() {
    const [data, setData] = useState<PriceData>({});
    const [prevData, setPrevData] = useState<PriceData>({});
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const navigate = useNavigate();

    const handleRowClick = (ticker: string): void => {
        navigate(`/details/${ticker}`);
    };

    const fetchData = useCallback(async (): Promise<void> => {
        try {
            const newPrices = await priceService.getPrices();

            setData(currentData => {
                if (JSON.stringify(newPrices) !== JSON.stringify(currentData)) {
                    setPrevData(currentData);
                    return newPrices;
                }
                return currentData;
            });

            setLastUpdated(new Date());
            setError(null);
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            }
        }
    }, []);

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 5000);
        return () => clearInterval(intervalId);
    }, [fetchData]);

    const getPriceChange = (code: string, currentPrice: number) => {
        const previousPrice = prevData[code];
        if (previousPrice === undefined) return null;

        const diff = currentPrice - previousPrice;
        if (diff === 0) return null;

        const colorClass = diff > 0 ? 'price-up' : 'price-down';
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
                <div className="error-container">
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
