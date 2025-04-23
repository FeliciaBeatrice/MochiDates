interface ButtonProps {
    text: string;
    color: "primary" | "secondary";
    onClick?: () => void;
}

export default function Button({ text, color, onClick }: ButtonProps) {
    return (
        <button
            className={`btn btn-${color} rounded-full text-background text-bold`}
            onClick={onClick}
        >
            {text}
        </button>
    );
}