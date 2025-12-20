import { useState } from 'react';
import './App.css';
import MarketPrices from '../MarketPrices/MarketPrices';
import TradingStrategyForm from '../TradingStrategyForm/TradingStrategyForm';
import TradingStrategies from '../TradingStrategies/TradingStrategies';
import TradingStrategyEditView from '../TradingStrategies/TradingStrategyEdit';
import { Routes, Route } from "react-router";
import DetailView from '../MarketPrices/MarketPriceDetails';

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
        <div className="app-container">
            <Routes>
                <Route path="/" element={
                    <div className="content-wrapper">
                        <div className="left-section">
                            <div className="content-wrapper main-form">
                                <div className="left-section">
                                    <TradingStrategyForm />
                                </div>
                                <div className="right-section">
                                    <MarketPrices />
                                </div>
                            </div>
                        </div>
                        <div className="right-section">
                            <TradingStrategies />
                        </div>
                    </div>
                } />
                <Route path="/details/:ticker" element={
                    <div className="content-wrapper">
                        <DetailView />
                    </div>
                } />
                <Route path="/tradingStrategyEdit/" element={
                    <div className="content-wrapper">
                        <TradingStrategyEditView />
                    </div>
                } />
            </Routes>
        </div>
    );
}

export default App;
