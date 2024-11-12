import { useCallback, useRef, useState } from 'react';

import type { EditableContentProps, UseEditableContentReturn } from '@/types/editable-content';
import { hasSpecialCharacters } from '@/utils/sanitization';

export const useEditableContent = (
    content: string,
    onUpdate: EditableContentProps['onUpdate'],
    type: EditableContentProps['type'],
): UseEditableContentReturn => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentContent, setCurrentContent] = useState(content);
    const [validationError, setValidationError] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleEdit = useCallback(async () => {
        if (validationError) {
            return;
        }

        if (currentContent !== content) {
            await onUpdate(currentContent);
        }
        setIsEditing(false);
    }, [currentContent, onUpdate, content, validationError]);

    const handleKeyDown = useCallback(
        async (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (event.key === 'Escape') {
                setIsEditing(false);
                setCurrentContent(content);
                setValidationError(null);
                return;
            }

            if (validationError) {
                return;
            }

            const isEnterPressed = event.key === 'Enter';
            const isDescriptionWithModifier = type === 'description' && (event.metaKey || event.ctrlKey);

            if ((type === 'title' && isEnterPressed) || (isDescriptionWithModifier && isEnterPressed)) {
                event.preventDefault();
                await handleEdit();
            }
        },
        [handleEdit, content, type, validationError],
    );

    const handleContentClick = useCallback(() => {
        setIsEditing(true);
        setTimeout(() => {
            if (type === 'title') {
                inputRef.current?.focus();
            } else {
                textareaRef.current?.focus();
            }
        }, 0);
    }, [type]);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = event.target.value;

        if (hasSpecialCharacters(newValue)) {
            setValidationError('Special characters are not allowed');
        } else {
            setValidationError(null);
        }

        setCurrentContent(newValue);
    }, []);

    const handleBlur = useCallback(() => {
        if (!validationError) {
            void handleEdit();
        }
    }, [handleEdit, validationError]);

    return {
        state: {
            isEditing,
            currentContent,
            validationError,
        },
        handlers: {
            handleEdit,
            handleKeyDown,
            handleContentClick,
            handleChange,
            handleBlur,
        },
        refs: {
            inputRef,
            textareaRef,
        },
    };
};
