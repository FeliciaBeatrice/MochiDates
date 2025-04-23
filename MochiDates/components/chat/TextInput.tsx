import React, { KeyboardEvent } from 'react';

interface TextInputProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    placeholder?: string;
    disabled?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
    value,
    onChange,
    onKeyDown,
    onSubmit,
    placeholder = "Start Typing ...",
    disabled = false,
}) => {
    return (
        <div className="flex items-center space-x-2">
            <input
                type="text"
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                className="input input-bordered w-full flex-grow rounded-full bg-base-300 focus:outline-none focus:border-primary px-4"
                disabled={disabled}
            />
            <button
                onClick={onSubmit}
                disabled={!value.trim() || disabled}
                className="btn btn-circle btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
            </button>
        </div>
    );
};

export default TextInput;