interface ButtonProps {
    text: string;
    onClick?: () => void;
}

export default function Button({ text, onClick }: ButtonProps) {
    return (
        <button
            className={`btn bg-primary rounded-full text-background text-bold`}
            onClick={onClick}
        >
            {text}
        </button>
    );
}