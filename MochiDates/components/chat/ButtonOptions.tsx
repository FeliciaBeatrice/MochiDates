// components/ButtonOptions.tsx
import React from 'react';
import Button from '../ui/Button';

interface ButtonOptionsProps {
    options: string[];
    onOptionClick: (option: string) => void;
    disabled?: boolean;
}

const ButtonOptions: React.FC<ButtonOptionsProps> = ({ options, onOptionClick, disabled = false }) => {
    return (
        <div className="flex justify-center items-center gap-3 flex-wrap">
            {options.map((option) => (
                <Button
                    key={option}
                    text={option}
                    onClick={() => onOptionClick(option)}
                />
            ))}
        </div>
    );
};

export default ButtonOptions;