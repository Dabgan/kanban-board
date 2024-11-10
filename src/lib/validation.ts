import type { Card, Column } from '@/types';
import type { ValidationResult } from '@/types/validation';

const TITLE_MAX_LENGTH = 100;
const TITLE_MIN_LENGTH = 3;
const DESCRIPTION_MAX_LENGTH = 500;

type ValidationRule = {
    condition: boolean;
    field: string;
    message: string;
};

const createValidationResult = (validations: ValidationRule[]): ValidationResult => {
    const errors = validations
        .filter((validation) => validation.condition)
        .map(({ field, message }) => ({ field, message }));

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const validateTitle = (title: string): ValidationResult => {
    if (!title.trim()) {
        return {
            isValid: false,
            errors: [{ field: 'title', message: 'Title is required' }],
        };
    }

    const validations: ValidationRule[] = [
        {
            condition: title.length < TITLE_MIN_LENGTH,
            field: 'title',
            message: `Title must be at least ${TITLE_MIN_LENGTH} characters`,
        },
        {
            condition: title.length > TITLE_MAX_LENGTH,
            field: 'title',
            message: `Title cannot exceed ${TITLE_MAX_LENGTH} characters`,
        },
    ];

    return createValidationResult(validations);
};

export const validateCard = (card: Card): ValidationResult => {
    const requiredFields: ValidationRule[] = [
        {
            condition: !card.title,
            field: 'title',
            message: 'Title is required',
        },
        {
            condition: !card.description,
            field: 'description',
            message: 'Description is required',
        },
        {
            condition: !card.columnId,
            field: 'columnId',
            message: 'Column ID is required',
        },
    ];

    const requiredValidation = createValidationResult(requiredFields);
    if (!requiredValidation.isValid) {
        return requiredValidation;
    }

    const titleValidation = validateTitle(card.title);
    if (!titleValidation.isValid) {
        return titleValidation;
    }

    const validations: ValidationRule[] = [
        {
            condition: card.description.length > DESCRIPTION_MAX_LENGTH,
            field: 'description',
            message: `Description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters`,
        },
    ];

    return createValidationResult(validations);
};

export const validateColumn = (column: Column, existingColumns: Column[]): ValidationResult => {
    const titleValidation = validateTitle(column.title);
    if (!titleValidation.isValid) {
        return titleValidation;
    }

    const validations: ValidationRule[] = [
        {
            condition: existingColumns.some(
                (existingColumn) =>
                    existingColumn.id !== column.id &&
                    existingColumn.title.toLowerCase() === column.title.toLowerCase(),
            ),
            field: 'title',
            message: 'Column title must be unique',
        },
        {
            condition: !Array.isArray(column.cardIds),
            field: 'cardIds',
            message: 'Column must have cardIds array',
        },
    ];

    return createValidationResult(validations);
};
