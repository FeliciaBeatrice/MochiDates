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
        // Use Tailwind gap for spacing
        <div className="flex justify-center items-center gap-3 flex-wrap">
            {options.map((option) => (
                <Button
                    key={option}
                    text={option}
                    color='secondary'
                    onClick={() => onOptionClick(option)}
                    // Apply specific styling variant if needed, otherwise uses default from Button component
                    // Example: Use a neutral-like button matching the screenshot
                    // variant="neutral" // Or use predefined variants
                />
            ))}
        </div>
    );
};

export default ButtonOptions;