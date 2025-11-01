import React, { useState, useEffect } from 'react';

// Replace with your actual API endpoint for prices
const API_URL = 'https://localhost:7250/api/Price/GetAllPrices';

function MarketPrices() {
    const [data, setData] = useState({}); // Change initial state to an object
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();

            // Update state with the nested 'Prices' object
            setData(result.Prices);
        } catch (e) {
            setError(e.message);
            console.error("Failed to fetch market prices:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        const interval = setInterval(() => {
            fetchData();
        }, 5000); // 60000 milliseconds = 60 seconds

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div>Loading market prices...</div>;
    }

    if (error) {
        return <div>Error fetching prices: {error}</div>;
    }

    // Use Object.entries to map over the key-value pairs
    return (
        <section className="prices-section">
            <h2>Live Market Prices</h2>
            <table className="prices-table">
                <thead>
                    <tr>
                        <th>Ticker</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data).map(([code, price]) => (
                        <tr key={code}>
                            <td>{code}</td>
                            <td>${price.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default MarketPrices;
