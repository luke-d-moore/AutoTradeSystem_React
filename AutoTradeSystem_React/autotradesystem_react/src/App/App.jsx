import { useState } from 'react';
import './App.css';
import MarketPrices from '../MarketPrices/MarketPrices'; // Import the new component
import TradingStrategyForm from '../TradingStrategyForm/TradingStrategyForm';
import TradingStrategies from '../TradingStrategies/TradingStrategies';

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
        <div class="app-container">
            <div>
                <h1>AutoTradeSystem_React</h1>
            </div>
            <div class="content-wrapper">
                <div class="left-section">
                    <div class="content-wrapper main-form">
                        <div class="left-section">
                            <TradingStrategyForm />
                        </div>
                        <div class="right-section">
                            <MarketPrices />
                        </div>
                    </div>
                </div>
                <div class="right-section">
                    <TradingStrategies />
                </div>
            </div>
        </div>

    );
}

export default App;
