import React, { useState } from 'react';
import DropdownComponent from '../DropDownComponent/DropDownComponent';

const TradingStrategyForm = () => {
    // State to manage form inputs
    const [formData, setFormData] = useState({
        Ticker: '',
        TradeAction: 0, 
        PriceChange: 0.0,
        Quantity: 0,
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    const API_URL = 'https://localhost:7158/api/TradingStrategy';

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prevData => ({
            ...prevData,
            // Convert specific inputs to numbers for the API payload
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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default browser form submission

        setMessage('Sending data...');
        setError(null);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // You might need to add other headers like Authorization if required by your API
                },
                // Convert the form state object to a JSON string
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                // If the server response was not ok, throw an error
                const errorData = await response.json(); // Attempt to read error message from API
                throw new Error(errorData.message || 'Failed to submit strategy');
            }

            // Handle successful response
            const result = await response.json(); // The API might return the saved object or a confirmation
            setMessage('Successfully submitted strategy');
            console.log('Success:', result);

            // Optionally reset the form
             setFormData({ Ticker: '', TradeAction: 0, PriceChange: 0.0, Quantity: 0 });

        } catch (err) {
            // Handle errors during the fetch operation
            setError('Failed to submit strategy');
            setMessage('');
            console.error('Error:', err);
        }
    };

    const TICKER_API_URL = 'https://localhost:7250/api/Price/GetTickers';

    return (
        <div>
            <h2>Submit Trading Strategy</h2>
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
                    <select
                        id="TradeAction"
                        name="TradeAction"
                        value={formData.TradeAction}
                        onChange={handleInputChange}
                    >
                        <option value="0">Buy</option>
                        <option value="1">Sell</option>
                    </select>
                </div>
                <div className="form-field">
                    <label htmlFor="PriceChange">Price Change:</label>
                    <input
                        type="number"
                        step="0.01" // Allows decimal input
                        id="PriceChange"
                        name="PriceChange"
                        value={formData.PriceChange}
                        onChange={handleChange}
                        required
                    />
                </div>
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
