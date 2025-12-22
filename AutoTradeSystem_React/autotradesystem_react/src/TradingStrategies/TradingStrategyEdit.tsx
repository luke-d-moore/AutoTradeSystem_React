import React from 'react';
import './TradingStrategyEdit.css';
import { useLocation } from 'react-router';
import { tradingService, type TradingStrategy } from '../services/tradingstrategy.service';

interface LocationState {
    tradingStrategy: TradingStrategy;
}

function TradingStrategyEditView() {
    const location = useLocation();

    const state = location.state as LocationState | null;
    const tradingStrategy = state?.tradingStrategy;

    if (!tradingStrategy) {
        return (
            <div className="error-container">
                No order data found. Please select a strategy from the list.
            </div>
        );
    }

    return (
        <section>
            <div className="construction-note">
                IMPORTANT NOTE: PAGE STILL UNDER CONSTRUCTION,
                BUT HERE ARE SOME DETAILS ABOUT THE STRATEGY YOU CLICKED ON
            </div>
            <div>
                <h3>Strategy Details</h3>
            </div>
            <div className="details-grid">
                <div>
                    <h3>Ticker: {tradingStrategy.ticker}</h3>
                </div>
                <div>
                    <h3>Action Price ($): {tradingStrategy.actionPrice}</h3>
                </div>
                <div>
                    <h3>Quantity: {tradingStrategy.quantity}</h3>
                </div>
                <div>
                    <h3>Trade Action: {tradingStrategy.tradeaction}</h3>
                </div>
                <div>
                    <h3>Threshold (%): {tradingStrategy.threshold}</h3>
                </div>
            </div>
        </section>
    );
}

export default TradingStrategyEditView;
