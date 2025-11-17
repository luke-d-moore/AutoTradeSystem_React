import { useState } from 'react';
import './App.css';
import MarketPrices from './MarketPrices'; // Import the new component
import TradingStrategyForm from './TradingStrategyForm';
import TradingStrategies from './TradingStrategies';

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
            </div>
            <div className="container">
                <TradingStrategyForm /> {/* Render the new component here */}
            </div>
            <div className="container">
                <MarketPrices /> {/* Render the new component here */}
            </div>
            <div className="container">
                <TradingStrategies /> {/* Render the new component here */}
            </div>
        </div>
    );
}

export default App;
