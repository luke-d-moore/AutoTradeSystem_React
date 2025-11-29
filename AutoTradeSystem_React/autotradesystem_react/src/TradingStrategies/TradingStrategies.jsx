import React, { useState, useEffect } from 'react';
import './TradingStrategies.css';

const TradingStrategies = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const API_URL = 'https://localhost:7158/api/TradingStrategy';
    const POLLING_INTERVAL = 5000;

    const fetchStrategies = async () => {
        try {
            setError(null);
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json(); 

            if (data.success && data.TradingStrategies) {
                const transformedOrders = Object.entries(data.TradingStrategies).map(([id, strategyDetails]) => {
                    const strategy = strategyDetails.TradingStrategy;
                    const originalPrice = strategyDetails.OriginalPrice;
                    const threshold = originalPrice > 0
                        ? (((strategyDetails.ActionPrice - originalPrice) / originalPrice) * 100).toFixed(2) + '%'
                        : 'N/A';

                    return {
                        id: id,
                        ticker: strategy.Ticker,
                        quantity: strategy.Quantity,
                        tradeaction: strategy.TradeAction === 0 ? 'Buy' : 'Sell',
                        threshold: threshold,
                    };
                });
                setOrders(transformedOrders);
                setLastUpdated(new Date());
            } else {
                setError(data.message || "Failed to retrieve successful data");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStrategies();
        const intervalId = setInterval(fetchStrategies, POLLING_INTERVAL);
        return () => clearInterval(intervalId);
    }, []);

    return (
            <section className="orders-section">
                <h2>Current Trading Strategies</h2>
                {lastUpdated && <p>Last updated: {lastUpdated.toLocaleTimeString()}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Ticker</th>
                                <th>Quantity</th>
                                <th>TradeAction</th>
                                <th>Threshold (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={order.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                                    <td>{order.ticker}</td>
                                    <td>{order.quantity}</td>
                                    <td>{order.tradeaction}</td>
                                    <td>{order.threshold}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            </section>
    );
};

export default TradingStrategies;
