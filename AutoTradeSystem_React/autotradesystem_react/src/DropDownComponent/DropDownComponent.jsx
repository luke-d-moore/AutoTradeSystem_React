import React, { useState, useEffect } from 'react';

const DropdownComponent = ({ id, name, value, onChange, required, apiEndpoint }) => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchItems = async () => {
        try {
            const response = await fetch(apiEndpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setItems(data.Tickers);
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
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
                <option key={index} value={item}>
                    {item}
                </option>
            ))}
        </select>
    );
};

export default DropdownComponent;
