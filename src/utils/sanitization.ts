export const hasSpecialCharacters = (value: string): boolean => {
    return /[<>'"&]/.test(value);
};

export const sanitizeForStorage = (value: string): string => {
    return value.trim().replace(/[<>'"&]/g, ''); // Remove special characters instead of encoding
};

export type SanitizableFields = {
    title: string;
    description?: string;
};

export const sanitizeRequestData = <T extends SanitizableFields>(data: T): T => {
    return {
        ...data,
        title: sanitizeForStorage(data.title),
        description: data.description ? sanitizeForStorage(data.description) : '',
    };
};
