import React, { type ChangeEvent } from 'react';

interface DropdownProps {
    id: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    items: string[];
}

const DropdownComponent: React.FC<DropdownProps> = ({
    id,
    name,
    value,
    onChange,
    required,
    items
}) => {


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
