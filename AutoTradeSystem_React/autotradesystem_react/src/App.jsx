import { useState } from 'react';
import './App.css';
import MarketPrices from './MarketPrices'; // Import the new component

function App() {
    const [formData, setFormData] = useState({
        ticker: '',
        amount: '',
        type: 'buy',
        threshold: '',
    });

    const [orders, setOrders] = useState([]);

    // Function to handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.ticker || !formData.amount || !formData.threshold) {
            alert('Please fill in all fields.');
            return;
        }

        // Add a unique ID to the new order
        const newOrder = {
            ...formData,
            id: Date.now(),
            date: new Date().toLocaleString(),
        };

        setOrders((prevOrders) => [...prevOrders, newOrder]);
        // Reset form fields
        setFormData({
            ticker: '',
            amount: '',
            type: 'buy',
            threshold: '',
        });
    };

    return (
        <div className="container">
            <div className="container">
                <h1>AutoTradeSystem</h1>

                {/* Section 1: Order Form */}
                <section className="form-section">
                    <h2>Add New Trading Strategy</h2>
                    <form onSubmit={handleSubmit} className="order-form">
                        <div className="form-field">
                            <label htmlFor="ticker">Ticker</label>
                            <input
                                type="text"
                                id="ticker"
                                name="ticker"
                                value={formData.ticker}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="amount">Amount</label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="type">Type</label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                            >
                                <option value="buy">Buy</option>
                                <option value="sell">Sell</option>
                            </select>
                        </div>
                        <div className="form-field">
                            <label htmlFor="threshold">Threshold (%)</label>
                            <input
                                type="number"
                                id="threshold"
                                name="threshold"
                                value={formData.threshold}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit">Submit Order</button>
                        </div>
                    </form>
                </section>
            </div>
            {/* Section 3: Live Prices Table */}
            <div className="container">
                <MarketPrices /> {/* Render the new component here */}
            </div>
            <div className="container">
                {/* Section 2: Past Orders Table */}
                <section className="orders-section">
                    <h2>Current Trading Strategies</h2>
                    {orders.length === 0 ? (
                        <p>No orders have been placed yet.</p>
                    ) : (
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Ticker</th>
                                    <th>Amount</th>
                                    <th>Type</th>
                                    <th>Threshold (%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={order.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                                        <td>{order.date}</td>
                                        <td>{order.ticker}</td>
                                        <td>{order.amount}</td>
                                        <td>{order.type}</td>
                                        <td>{order.threshold}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </div>
        </div>
    );
}

export default App;
