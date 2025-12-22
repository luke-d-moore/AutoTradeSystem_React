import axios from 'axios';

const BASE_URL = 'https://localhost:7250/api/Price/';
export const PRICES_API_URL = `${BASE_URL}GetAllPrices`;
export const TICKERS_API_URL = `${BASE_URL}GetTickers`;

const axiosConfig = {
    timeout: 3000
};

export interface TickerResponse {
    Tickers: string[];
}

export interface PriceData {
    [ticker: string]: number;
}

export type { PriceData, TickerResponse }; 

export const priceService = {
    getPrices: async (): Promise<PriceData> => {
        const { data } = await axios.get<{ Prices: PriceData }>(
            PRICES_API_URL,
            axiosConfig
        );
        return data.Prices;
    },

    getTickers: async (): Promise<TickerResponse> => {
        const { data } = await axios.get<{ Tickers: string[] }>(
            TICKERS_API_URL,
            axiosConfig
        );
        return { Tickers: data.Tickers };
    }
};
