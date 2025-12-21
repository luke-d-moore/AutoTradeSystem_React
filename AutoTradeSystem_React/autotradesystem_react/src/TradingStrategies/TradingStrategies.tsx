import React, { useState, useEffect, JSX } from 'react';
import './TradingStrategies.css';
import deleteIcon from './delete-24.ico';
import { useNavigate } from 'react-router';

interface RawStrategy {
    Ticker: string;
    Quantity: number;
    TradeAction: number;
}

interface StrategyDetails {
    TradingStrategy: RawStrategy;
    OriginalPrice: number;
    ActionPrice: number;
}

interface ApiResponse {
    success: boolean;
    message?: string;
    TradingStrategies: { [key: string]: StrategyDetails };
}

interface TransformedOrder {
    id: string;
    ticker: string;
    quantity: number;
    tradeaction: 'Buy' | 'Sell';
    threshold: string;
    actionPrice: string;
}

const TradingStrategies: React.FC = () => {
    const [orders, setOrders] = useState < TransformedOrder[] > ([]);
    const [loading, setLoading] = useState < boolean > (true);
    const [error, setError] = useState < string | null > (null);
    const [deleted, setDeleted] = useState < string | null > (null);
    const [lastUpdated, setLastUpdated] = useState < Date | null > (null);

    const API_URL = 'https://localhost:7158/api/TradingStrategy';
    const POLLING_INTERVAL = 5000;

    const navigate = useNavigate();

    const handleRowClick = (order: TransformedOrder): void => {
        navigate(`/tradingStrategyEdit/`, { state: { order } });
    };

    const handleDelete = async (orderId: string): Promise<void> => {
        if (!window.confirm(`Are you sure you want to delete this strategy?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setDeleted(`Successfully deleted strategy!`);
            setOrders(prev => prev.filter(order => order.id !== orderId));

        } catch (err: unknown) {
            console.error("Error deleting order:", err);
            setError(`Failed to delete strategy`);
        }
    };

    const fetchStrategies = async (): Promise<void> => {
        try {
            setError(null);
            setDeleted(null);
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ApiResponse = await response.json();

            if (data.success && data.TradingStrategies) {
                const transformedOrders: TransformedOrder[] = Object.entries(data.TradingStrategies).map(([id, strategyDetails]) => {
                    const strategy = strategyDetails.TradingStrategy;
                    const originalPrice = strategyDetails.OriginalPrice;
                    const actionPrice = strategyDetails.ActionPrice.toFixed(2);

                    const threshold = originalPrice > 0
                        ? (((strategyDetails.ActionPrice - originalPrice) / originalPrice) * 100).toFixed(2) + '%'
                        : 'N/A';

                    return {
                        id: id,
                        ticker: strategy.Ticker,
                        quantity: strategy.Quantity,
                        tradeaction: strategy.TradeAction === 0 ? 'Buy' : 'Sell',
                        threshold: threshold,
                        actionPrice: actionPrice,
                    };
                });
                setOrders(transformedOrders);
                setLastUpdated(new Date());
            } else {
                setError(data.message || "Failed to retrieve successful data");
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Unknown error';
            setError(msg);
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
            {deleted && <p style={{ color: 'green' }}>{deleted}</p>}
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>Ticker</th>
                        <th>Quantity</th>
                        <th>TradeAction</th>
                        <th>Threshold (%)</th>
                        <th>Action Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={order.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                            onClick={() => handleRowClick(order)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{order.ticker}</td>
                            <td>{order.quantity}</td>
                            <td>{order.tradeaction}</td>
                            <td>{order.threshold}</td>
                            <td>${order.actionPrice}</td>
                            <td>
                                <img
                                    src={deleteIcon}
                                    alt="Delete order"
                                    className="delete-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(order.id);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
};

export default TradingStrategies;
