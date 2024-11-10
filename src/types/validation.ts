export type ValidationError = {
    field: string;
    message: string;
};

export type ValidationResult = {
    isValid: boolean;
    errors: ValidationError[];
};

export type ValidationRule = {
    condition: boolean;
    field: string;
    message: string;
};

export type ValidationRules = {
    maxLength: number;
    minLength: number;
    isRequired: boolean;
};
