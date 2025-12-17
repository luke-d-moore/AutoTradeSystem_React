import React, { useState } from 'react';
import DropdownComponent from '../DropDownComponent/DropDownComponent';

const TradingStrategyForm = () => {
    const [usePriceChange, setUsePriceChange] = useState(true);
    const [formData, setFormData] = useState({
        Ticker: '',
        TradeAction: 0,
        PriceChange: 0.0,
        ActionPrice: 0.0,
        Quantity: 0,
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    const API_URL = 'https://localhost:7158/api/TradingStrategy';

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'number' ? parseFloat(value) || parseInt(value) || 0 : value,
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: Number(value),
        }));
    };

    const handleTogglePriceChange = () => {
        setUsePriceChange(true);
        setFormData(prevData => ({
            ...prevData,
            ActionPrice: 0.0,
        }));
    };

    const handleToggleActionPrice = () => {
        setUsePriceChange(false);
        setFormData(prevData => ({
            ...prevData,
            PriceChange: 0.0,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submissionData = { ...formData };
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
            setError('Failed to submit strategy');
            setMessage('');
        }
    };

    const TICKER_API_URL = 'https://localhost:7250/api/Price/GetTickers';

    return (
        <div>
            <h2>Submit Trading Strategy</h2>

            <div className="radio-form">
                <div>
                    <label>
                        <input
                            type="radio"
                            checked={usePriceChange}
                            onChange={handleTogglePriceChange}
                        /> Use Price Change (%)
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="radio"
                            checked={!usePriceChange}
                            onChange={handleToggleActionPrice}
                        /> Use Specific Action Price
                    </label>
                </div>
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
                        apiEndpoint={TICKER_API_URL}
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
