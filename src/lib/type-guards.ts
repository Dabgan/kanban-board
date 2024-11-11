import type { Card } from '@/types/card';
import type { Column } from '@/types/column';

type PropertyType = 'string' | 'number' | 'array';

type PropertyValidation = {
    key: string;
    type: PropertyType;
};

const typeValidators: Record<PropertyType, (value: unknown) => boolean> = {
    string: (value): value is string => typeof value === 'string',
    number: (value): value is number => typeof value === 'number',
    array: Array.isArray,
};

const validateProperty = (data: Record<string, unknown>, validation: PropertyValidation): boolean => {
    const validator = typeValidators[validation.type];
    return validator(data[validation.key]);
};

const validateProperties = (data: Record<string, unknown>, validations: PropertyValidation[]): boolean => {
    return validations.every((validation) => validateProperty(data, validation));
};

const baseValidation = (data: unknown): data is Record<string, unknown> => {
    return typeof data === 'object' && data !== null;
};

const cardBaseValidations: PropertyValidation[] = [
    { key: 'id', type: 'string' },
    { key: 'title', type: 'string' },
    { key: 'description', type: 'string' },
    { key: 'columnId', type: 'string' },
];

const columnBaseValidations: PropertyValidation[] = [
    { key: 'id', type: 'string' },
    { key: 'title', type: 'string' },
    { key: 'cardIds', type: 'array' },
];

export const isCardRequest = (data: unknown): data is Card => {
    if (!baseValidation(data)) return false;
    return validateProperties(data, [...cardBaseValidations, { key: 'order', type: 'number' }]);
};

export const isCardRequestWithoutOrder = (data: unknown): data is Omit<Card, 'order'> => {
    if (!baseValidation(data)) return false;
    return validateProperties(data, cardBaseValidations);
};

export const isColumnRequest = (data: unknown): data is Column => {
    if (!baseValidation(data)) return false;
    return validateProperties(data, [...columnBaseValidations, { key: 'order', type: 'number' }]);
};

export const isColumnRequestWithoutOrder = (data: unknown): data is Omit<Column, 'order'> => {
    if (!baseValidation(data)) return false;
    return validateProperties(data, columnBaseValidations);
};
