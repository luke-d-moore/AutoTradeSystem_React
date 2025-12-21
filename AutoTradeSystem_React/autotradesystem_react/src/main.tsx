import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router";
import App from './App/App';
import './index.css';

const container = document.getElementById('root');

if (!container) {
    throw new Error("Failed to find the root element. Check your index.html.");
}

const root = createRoot(container);

root.render(
    <div>
        <h1>AutoTradeSystem_React</h1>
        <React.StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </React.StrictMode>
    </div>
);
