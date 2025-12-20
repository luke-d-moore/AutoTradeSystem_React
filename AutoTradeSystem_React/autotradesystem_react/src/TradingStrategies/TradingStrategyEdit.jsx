import React, { useState, useEffect } from 'react';
import './TradingStrategyEdit.css';
import { useLocation } from 'react-router';

function TradingStrategyEditView() {
    const location = useLocation();
    const order = location.state?.order;

    if (!order) return <div>No order data found</div>;

    return (
        <section>
        <div>IMPORTANT NOTE PAGE STILL UNDER CONSTRUCTION, BUT HERE ARE SOME DETAILS ABOUT THE STRATEGY YOU CLICKED ON</div>
            <div>
                <h3>Strategy Details</h3>
            </div>
            <div>
                <h3>Ticker : {order.ticker}</h3>
            </div>
            <div>
                <h3>Action Price ($) : {order.actionPrice}</h3>
            </div>
            <div>
                <h3>Quantity : {order.quantity}</h3>
            </div>
            <div>
                <h3>Trade Action : {order.tradeaction}</h3>
            </div>
            <div>
                <h3>Threshold (%) : {order.threshold}</h3>
            </div>
        </section>
    );
}

export default TradingStrategyEditView;