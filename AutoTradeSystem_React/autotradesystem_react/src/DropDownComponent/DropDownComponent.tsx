import React, { useState, useEffect, type ChangeEvent } from 'react';

interface DropdownProps {
    id: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    apiEndpoint: string;
    dataKey?: string;
}

const DropdownComponent: React.FC<DropdownProps> = ({
    id,
    name,
    value,
    onChange,
    required,
    apiEndpoint,
    dataKey
}) => {
    const [items, setItems] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const findArrayInResponse = (data: any): string[] => {
        if (dataKey && Array.isArray(data[dataKey])) return data[dataKey];

        if (Array.isArray(data)) return data;

        const firstArrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
        return firstArrayKey ? data[firstArrayKey] : [];
    };

    const fetchItems = async (): Promise<void> => {
        try {
            const response = await fetch(apiEndpoint);
            if (!response.ok) throw new Error(`HTTP status: ${response.status}`);

            const json = await response.json();
            const extractedItems = findArrayInResponse(json);

            setItems(extractedItems);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Fetch failed');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
        const intervalId = setInterval(fetchItems, 30000);
        return () => clearInterval(intervalId);
    }, [apiEndpoint]);

    return (
        <select
            id={id}
            name={name}
            value={value || ''}
            onChange={onChange}
            required={required}
        >
            <option value="">-- Select an item --</option>
            {items.map((item, index) => (
                <option key={`${item}-${index}`} value={item}>
                    {item}
                </option>
            ))}
        </select>
    );
};

export default DropdownComponent;
