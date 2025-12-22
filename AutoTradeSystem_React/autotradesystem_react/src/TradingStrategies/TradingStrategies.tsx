import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import './TradingStrategies.css';
import deleteIcon from './delete-24.ico';
import { tradingService, type TradingStrategy } from '../services/tradingstrategy.service';

const TradingStrategies: React.FC = () => {
    const [tradingStrategies, setTradingStrategies] = useState<TradingStrategy[] > ([]);
    const [error, setError] = useState < string | null > (null);
    const [deleted, setDeleted] = useState < string | null > (null);
    const [lastUpdated, setLastUpdated] = useState < Date | null > (null);

    const POLLING_INTERVAL = 5000;

    const navigate = useNavigate();

    const handleRowClick = (tradingStrategy: TradingStrategy): void => {
        navigate(`/tradingStrategyEdit/`, { state: { tradingStrategy } });
    };

    const handleDelete = async (orderId: string): Promise<void> => {
        if (!window.confirm(`Are you sure you want to delete this strategy?`)) {
            return;
        }

        try {
            await tradingService.deleteStrategy(orderId);

            setDeleted(`Successfully deleted strategy!`);
            setTradingStrategies(prev => prev.filter(order => order.id !== orderId));

        } catch (err: unknown) {
            console.error("Error deleting order:", err);
            setError(`Failed to delete strategy`);
        }
    };

    const fetchStrategies = async (): Promise<void> => {
        try {
            setError(null);
            setDeleted(null);
            const strategies = await tradingService.getStrategies();
            setTradingStrategies(strategies);
            setLastUpdated(new Date());
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Unknown error';
            setError(msg);
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
                    {tradingStrategies.map((tradingStrategy, index) => (
                        <tr key={tradingStrategy.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                            onClick={() => handleRowClick(tradingStrategy)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{tradingStrategy.ticker}</td>
                            <td>{tradingStrategy.quantity}</td>
                            <td>{tradingStrategy.tradeaction}</td>
                            <td>{tradingStrategy.threshold}</td>
                            <td>${tradingStrategy.actionPrice}</td>
                            <td>
                                <img
                                    src={deleteIcon}
                                    alt="Delete order"
                                    className="delete-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(tradingStrategy.id);
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
