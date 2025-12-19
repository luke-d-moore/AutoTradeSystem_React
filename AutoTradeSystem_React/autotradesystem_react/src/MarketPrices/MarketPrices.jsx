import React, { useState, useEffect } from 'react';
import './MarketPrices.css';

const API_URL = 'https://localhost:7250/api/Price/GetAllPrices';

function MarketPrices() {
    const [data, setData] = useState({});
    const [prevData, setPrevData] = useState({});
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchData = async () => {
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

            const result = await response.json();
            const newPrices = result.Prices || {};

            const hasChanged = JSON.stringify(newPrices) !== JSON.stringify(data);

//Interview Tip
//In an interview, you can mention that JSON.stringify is a "quick and dirty" way to compare objects, 
//but it has pitfalls like key - ordering.For a more production - ready approach, 
//you would use a shallow equality function that iterates through keys or a library like Lodash(_.isEqual). 

            if (hasChanged) {
                setPrevData(data);
                setData(newPrices);
            }

            setLastUpdated(new Date());
            setError(null);

        } catch (e) {
            clearTimeout(timeoutId);
            if (e.name === 'AbortError') {
                setError(`Request timed out after ${TIMEOUT_DURATION / 1000} seconds.`);
                console.error("Fetch request aborted due to timeout:", e);
            } else {
                setError(e.message);
                console.error("Failed to fetch market prices:", e);
            }
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 5000);
        return () => clearInterval(intervalId);
    }, [data]);

    const getPriceChange = (code, currentPrice) => {
        const previousPrice = prevData[code];
        if (previousPrice === undefined) return null;

        const diff = currentPrice - previousPrice;
        const colorClass = diff ===0 ? '' : diff > 0 ? 'price-up' : 'price-down';
        const sign = diff > 0 ? '+' : '';

        return (
            <span>(<span className={colorClass}>
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
                    <div className="retry-message">Automatic retry...</div>
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
                        <tr key={code} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                            <td className="ticker-column">{code}</td>
                            <td className="price-column">${price.toFixed(2)} {getPriceChange(code, price)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default MarketPrices;
