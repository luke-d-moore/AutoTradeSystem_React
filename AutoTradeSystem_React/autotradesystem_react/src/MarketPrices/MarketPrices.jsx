import React, { useState, useEffect } from 'react';

const API_URL = 'https://localhost:7250/api/Price/GetAllPrices';

function MarketPrices() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchData = async () => {
        setError(null);
        setLoading(true);

        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();

            setData(result.Prices || {});
            setLastUpdated(new Date());
        } catch (e) {
            setError(e.message);
            console.error("Failed to fetch market prices:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        const intervalId = setInterval(() => {
            console.log("Attempting automatic refresh...");
            fetchData();
        }, 5000); 

        return () => clearInterval(intervalId);
    }, []); 

     if (error) {
        return (
            <section className="prices-section">
                <h2>Live Market Prices</h2>
                {lastUpdated && <p>Last updated: {lastUpdated.toLocaleTimeString()}</p>}
                <div className="error-message">Error getting latest prices</div>
                <div className="retry-message">Automatic retry happening in 5 seconds</div>
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

    return (
        <section className="prices-section">
            <h2>Live Market Prices</h2>
            {lastUpdated && <p>Last updated: {lastUpdated.toLocaleTimeString()}</p>}
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
