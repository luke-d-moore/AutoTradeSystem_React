import React, { useState, useEffect } from 'react';

// Replace with your actual API endpoint for prices
const API_URL = 'https://localhost:7250/api/Price/GetAllPrices';

function MarketPrices() {
    // data is initialized as an empty object, serving as the safe default value
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchData = async () => {
        // Clear previous errors and set loading state before a new attempt
        setError(null);
        setLoading(true);

        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();

            // Assume the API returns an object like { Prices: { Ticker: Value } }
            setData(result.Prices || {});
            setLastUpdated(new Date());
        } catch (e) {
            // Set the error state
            //setData({});
            setError(e.message);
            console.error("Failed to fetch market prices:", e);
        } finally {
            // Always set loading to false after the fetch operation finishes
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch upon component mount
        fetchData();

        // Set up the interval for continuous polling
        const intervalId = setInterval(() => {
            console.log("Attempting automatic refresh...");
            fetchData();
        }, 5000); // Poll every 5 seconds

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array means this effect runs once

    // --- Render Logic ---

    //// If loading for the very first time, show only loading indicator
    //if (loading && Object.keys(data).length === 0 && !error) {
    //    return (
    //        <section className="prices-section">
    //            <h2>Live Market Prices</h2>
    //            <div>Loading market prices...</div>
    //            <table className="prices-table">
    //                <thead>
    //                    <tr>
    //                        <th>Ticker</th>
    //                        <th>Price</th>
    //                    </tr>
    //                </thead>
    //                <tbody>
    //                    {/* Use Object.entries to map over the key-value pairs */}
    //                    {Object.entries(data).map(([code, price]) => (
    //                        <tr key={code}>
    //                            <td>{code}</td>
    //                            <td>${price.toFixed(2)}</td>
    //                        </tr>
    //                    ))}
    //                </tbody>
    //            </table>
    //        </section>
    //    );
    //}

    // If there is an error, display the error message and let the interval continue retrying in the background.
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
                        {/* Use Object.entries to map over the key-value pairs */}
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
