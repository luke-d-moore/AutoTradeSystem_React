import React, { useState, useEffect, ChangeEvent } from 'react';

interface DropdownProps {
    id: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    apiEndpoint: string;
}

interface TickerResponse {
    Tickers: string[];
}

const DropdownComponent: React.FC<DropdownProps> = ({
    id,
    name,
    value,
    onChange,
    required,
    apiEndpoint
}) => {
    const [items, setItems] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = async (): Promise<void> => {
        try {
            const response = await fetch(apiEndpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: TickerResponse = await response.json();
            setItems(data.Tickers || []);
            setIsLoading(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
        const intervalId = setInterval(fetchItems, 30000);
        return () => clearInterval(intervalId);
    }, [apiEndpoint]);

    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <select
            id={id}
            name={name}
            value={value || ''}
            onChange={onChange}
            required={required}
            disabled={isLoading}
        >
            <option value="">
                {isLoading ? '-- Loading items... --' : '-- Select an item --'}
            </option>
            {items.map((item, index) => (
                <option key={`${item}-${index}`} value={item}>
                    {item}
                </option>
            ))}
        </select>
    );
};

export default DropdownComponent;
