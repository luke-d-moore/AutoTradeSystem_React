import axios from 'axios';

const API_URL = 'https://localhost:7250/api/Price/';

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
            `${API_URL}GetAllPrices`,
            axiosConfig
        );
        return data.Prices;
    },

    getTickers: async (): Promise<TickerResponse> => {
        const { data } = await axios.get<{ Tickers: string[] }>(
            `${API_URL}GetTickers`,
            axiosConfig
        );
        return { Tickers: data.Tickers };
    }
};
