import { useCallback, useRef, useState } from 'react';

import { KEYBOARD_KEYS } from '@/constants/editable-content';
import type { EditableContentProps, UseEditableContentReturn } from '@/types/editable-content';

import { useContentValidation } from './use-content-validation';

const createInitialState = (content: string) => ({
    isEditing: false,
    currentContent: content,
});

export const useEditableContent = (
    content: string,
    onUpdate: EditableContentProps['onUpdate'],
    type: EditableContentProps['type'],
): UseEditableContentReturn => {
    const [state, setState] = useState(() => createInitialState(content));
    const { validationError, validateContent } = useContentValidation();

    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleEdit = useCallback(async () => {
        if (validationError ?? state.currentContent === content) {
            return;
        }

        await onUpdate(state.currentContent);
        setState((prevState) => ({ ...prevState, isEditing: false }));
    }, [state.currentContent, onUpdate, content, validationError]);

    const handleKeyDown = useCallback(
        async (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { key, metaKey, ctrlKey } = event;

            if (key === KEYBOARD_KEYS.ESCAPE) {
                setState((prevState) => ({
                    ...prevState,
                    isEditing: false,
                    currentContent: content,
                }));
                return;
            }

            if (validationError) {
                return;
            }

            const shouldSave =
                type === 'title' ? key === KEYBOARD_KEYS.ENTER : key === KEYBOARD_KEYS.ENTER && (metaKey || ctrlKey);

            if (shouldSave) {
                event.preventDefault();
                await handleEdit();
            }
        },
        [handleEdit, content, type, validationError],
    );

    const handleContentClick = useCallback(() => {
        setState((prevState) => ({ ...prevState, isEditing: true }));

        setTimeout(() => {
            const elementToFocus = type === 'title' ? inputRef.current : textareaRef.current;
            elementToFocus?.focus();
        }, 0);
    }, [type]);

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const newValue = event.target.value;
            validateContent(newValue);
            setState((prevState) => ({ ...prevState, currentContent: newValue }));
        },
        [validateContent],
    );

    const handleBlur = useCallback(() => {
        if (!validationError) {
            void handleEdit();
        }
    }, [handleEdit, validationError]);

    return {
        state: {
            ...state,
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
