import React, { useState, useEffect } from 'react';

const DropdownComponent = ({ id, name, value, onChange, required, apiEndpoint }) => {
    // State to hold the fetched data (list of strings)
    const [items, setItems] = useState([]);
    // State to manage loading status
    const [isLoading, setIsLoading] = useState(true);
    // State to handle any potential errors
    const [error, setError] = useState(null);

    // Function to handle the API request
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
