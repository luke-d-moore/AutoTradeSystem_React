import React from 'react';
import { useParams } from 'react-router';
import './MarketPrices.css';

type MarketParams = {
    ticker: string;
};

function DetailView(){
    const { ticker } = useParams < MarketParams > ();

    return (
        <section>
            <div>
                IMPORTANT NOTE: PAGE STILL UNDER CONSTRUCTION,
                BUT HERE ARE SOME DETAILS ABOUT THE LIVE MARKET PRICE YOU CLICKED ON
            </div>
            <div>
                <h3>Details for {ticker}</h3>
            </div>
        </section>
    );
}

export default DetailView;
