export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonProps = {
    size?: ButtonSize;
    variant?: ButtonVariant;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export type InputProps = {
    error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;
