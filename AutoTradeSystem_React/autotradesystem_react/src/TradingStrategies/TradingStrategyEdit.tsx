import React from 'react';
import './TradingStrategyEdit.css';
import { useLocation } from 'react-router';

interface Order {
    ticker: string;
    actionPrice: number;
    quantity: number;
    tradeaction: string | number; 
    threshold: number;
}

interface LocationState {
    order: Order;
}

function TradingStrategyEditView(): React.JSX.Element {
    const location = useLocation();

    const state = location.state as LocationState | null;
    const order = state?.order;

    if (!order) {
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
                    <h3>Ticker: {order.ticker}</h3>
                </div>
                <div>
                    <h3>Action Price ($): {order.actionPrice}</h3>
                </div>
                <div>
                    <h3>Quantity: {order.quantity}</h3>
                </div>
                <div>
                    <h3>Trade Action: {order.tradeaction}</h3>
                </div>
                <div>
                    <h3>Threshold (%): {order.threshold}</h3>
                </div>
            </div>
        </section>
    );
}

export default TradingStrategyEditView;
