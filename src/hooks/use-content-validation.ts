import { useCallback, useState } from 'react';

import { EDITABLE_CONTENT_CONSTANTS } from '@/constants/editable-content';
import { hasSpecialCharacters } from '@/utils/sanitization';

export const useContentValidation = () => {
    const [validationError, setValidationError] = useState<string | null>(null);

    const clearError = useCallback(() => {
        setValidationError(null);
    }, []);

    const validateContent = useCallback((content: string) => {
        if (hasSpecialCharacters(content)) {
            setValidationError(EDITABLE_CONTENT_CONSTANTS.VALIDATION_ERROR);
            return false;
        }

        setValidationError(null);
        return true;
    }, []);

    return {
        validationError,
        validateContent,
        clearError,
    };
};
