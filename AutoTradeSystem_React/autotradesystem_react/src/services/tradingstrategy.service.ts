import axios from 'axios';

const API_URL = 'https://localhost:7158/api/TradingStrategy';

const api = axios.create({
    timeout: 3000
});

export interface Strategy {
    Ticker: string;
    Quantity: number;
    TradeAction: number;
    PriceChange: number;
    ActionPrice: number;
}

export interface TradingStrategy {
    id: string;
    ticker: string;
    quantity: number;
    actionPrice: number;
    tradeaction: string;
    threshold: string;
}

export type { TradingStrategy }; 

export const tradingService = {
    getStrategies: async (): Promise<TradingStrategy[]> => {
        try {
            const { data } = await api.get(API_URL);

            if (!data.success || !data.TradingStrategies) return [];

            return Object.entries(data.TradingStrategies).map(([id, details]: any) => {
                const { TradingStrategy, OriginalPrice, ActionPrice } = details;
                const threshold = OriginalPrice > 0
                    ? (((ActionPrice - OriginalPrice) / OriginalPrice) * 100).toFixed(2) + '%'
                    : 'N/A';

                return {
                    id,
                    ticker: TradingStrategy.Ticker,
                    quantity: TradingStrategy.Quantity,
                    tradeaction: TradingStrategy.TradeAction === 0 ? 'Buy' : 'Sell',
                    threshold,
                    actionPrice: ActionPrice.toFixed(2),
                };
            });
        } catch (error: any) {
            if (error.code === 'ECONNABORTED') {
                console.error('Fetch strategies request timed out');
            }
            console.error('Error fetching strategies:', error);
            return [];
        }
    },

    deleteStrategy: async (id: string) => {
        try {
            const { data } = await api.delete(`${API_URL}/${id}`);
            if (!data.success) throw new Error(data.message || 'Delete Strategy failed');
            return data;
        } catch (error) {
            console.error(`Error deleting strategy ${id}:`, error);
        }
    },

    updateStrategy: async (id: string, strategy: Strategy) => {
        try {
            const { data } = await api.put(API_URL, [id, strategy]);
            if (!data.success) throw new Error(data.message || 'Update Strategy failed');
            return data;
        } catch (error: any) {
            const msg = error.code === 'ECONNABORTED'
                ? 'Request timed out'
                : (error.response?.data?.message || error.message || 'Network error');
            throw new Error(msg);
        }
    },

    postStrategy: async (strategy: Strategy) => {
        try {
            const { data } = await api.post(API_URL, strategy);
            if (!data.success) throw new Error(data.message || 'Submission failed');
            return data;
        } catch (error: any) {
            const msg = error.code === 'ECONNABORTED'
                ? 'Request timed out'
                : (error.response?.data?.message || error.message || 'Network error');
            throw new Error(msg);
        }
    }
};
