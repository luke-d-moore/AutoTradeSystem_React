import { useState } from 'react';
import './App.css';
import MarketPrices from '../MarketPrices/MarketPrices';
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.ticker || !formData.amount || !formData.threshold) {
            alert('Please fill in all fields.');
            return;
        }

        const newOrder = {
            ...formData,
            id: Date.now(),
            date: new Date().toLocaleString(),
        };

        setOrders((prevOrders) => [...prevOrders, newOrder]);
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
