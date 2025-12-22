import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import DropdownComponent from '../DropDownComponent/DropDownComponent';
import { priceService, TICKERS_API_URL } from '../services/price.service';


interface TradingStrategy {
    Ticker: string;
    TradeAction: number;
    PriceChange: number;
    ActionPrice: number;
    Quantity: number;
}

const TradingStrategyForm: React.FC = () => {
    const [usePriceChange, setUsePriceChange] = useState < boolean > (true);
    const [formData, setFormData] = useState < TradingStrategy > ({
        Ticker: '',
        TradeAction: 0,
        PriceChange: 0.0,
        ActionPrice: 0.0,
        Quantity: 0,
    });
    const [message, setMessage] = useState < string > ('');
    const [error, setError] = useState < string | null > (null);

    const API_URL = 'https://localhost:7158/api/TradingStrategy';

    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage('');
                setError(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, error]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: Number(value),
        }));
    };

    const handleToggleActionPrice = () => {
        if (usePriceChange) {
            setUsePriceChange(false);
            setFormData(prevData => ({ ...prevData, ActionPrice: 0.0 }));
        } else {
            setUsePriceChange(true);
            setFormData(prevData => ({ ...prevData, PriceChange: 0.0 }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const submissionData: TradingStrategy = { ...formData };
        if (usePriceChange) {
            submissionData.ActionPrice = 0;
        } else {
            submissionData.PriceChange = 0;
        }

        setMessage('Sending data...');
        setError(null);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit strategy');
            }

            setMessage('Successfully submitted strategy');
            setFormData({ Ticker: '', TradeAction: 0, PriceChange: 0.0, ActionPrice: 0.0, Quantity: 0 });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to submit strategy';
            setError(errorMessage);
            setMessage('');
        }
    };

    return (
        <div>
            <h2>Submit Trading Strategy</h2>

            <div>
                <label className="switch">
                    <input
                        type="checkbox"
                        id="toggle"
                        checked={!usePriceChange}
                        onChange={handleToggleActionPrice}
                    />
                    <span className="slider"></span>
                </label>
                <label>Use Specific Action Price</label>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="Ticker">Ticker:</label>
                    <DropdownComponent
                        id="Ticker"
                        name="Ticker"
                        value={formData.Ticker}
                        onChange={handleChange}
                        required
                        apiEndpoint={TICKERS_API_URL}
                        dataKey = "Tickers"
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="TradeAction">Trade Action</label>
                    <select id="TradeAction" name="TradeAction" value={formData.TradeAction} onChange={handleInputChange}>
                        <option value="0">Buy</option>
                        <option value="1">Sell</option>
                    </select>
                </div>

                {usePriceChange ? (
                    <div className="form-field">
                        <label htmlFor="PriceChange">Price Change (%):</label>
                        <input
                            type="number"
                            step="0.01"
                            id="PriceChange"
                            name="PriceChange"
                            value={formData.PriceChange}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ) : (
                    <div className="form-field">
                        <label htmlFor="ActionPrice">Action Price ($):</label>
                        <input
                            type="number"
                            step="0.01"
                            id="ActionPrice"
                            name="ActionPrice"
                            value={formData.ActionPrice}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}

                <div className="form-field">
                    <label htmlFor="Quantity">Quantity:</label>
                    <input
                        type="number"
                        id="Quantity"
                        name="Quantity"
                        value={formData.Quantity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Submit Strategy</button>
            </form>

            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </div>
    );
};

export default TradingStrategyForm;
