import { useCallback, useRef, useState } from 'react';

import { KEYBOARD_KEYS } from '@/constants/editable-content';
import type { EditableContentProps, UseEditableContentReturn } from '@/types/editable-content';

import { useContentValidation } from './use-content-validation';

export const useEditableContent = (
    content: string,
    onUpdate: EditableContentProps['onUpdate'],
    type: EditableContentProps['type'],
    operation?: EditableContentProps['operation'],
): UseEditableContentReturn => {
    const [state, setState] = useState({
        isEditing: false,
        currentContent: content,
    });
    const { validationError, validateContent, clearError } = useContentValidation();

    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const clearState = useCallback(() => {
        clearError();
        setState((prevState) => ({
            ...prevState,
            isEditing: false,
            currentContent: content,
        }));
    }, [clearError, content]);

    const handleEdit = useCallback(async () => {
        if (validationError ?? state.currentContent === content) {
            return;
        }

        await onUpdate(state.currentContent);
        clearError();
        setState((prevState) => ({
            ...prevState,
            isEditing: false,
        }));
    }, [state.currentContent, onUpdate, validationError, clearError, content]);

    const handleKeyDown = useCallback(
        async (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { key, metaKey, ctrlKey } = event;

            if (key === KEYBOARD_KEYS.ESCAPE) {
                clearState();
                return;
            }

            if (validationError) {
                return;
            }

            const shouldSave = type.includes('title')
                ? key === KEYBOARD_KEYS.ENTER
                : key === KEYBOARD_KEYS.ENTER && (metaKey || ctrlKey);

            if (shouldSave) {
                event.preventDefault();
                await handleEdit();
            }
        },
        [handleEdit, type, validationError, clearState],
    );

    const handleContentClick = useCallback(() => {
        operation === 'add'
            ? setState((prevState) => ({ ...prevState, isEditing: true, currentContent: '' }))
            : setState((prevState) => ({ ...prevState, isEditing: true }));

        setTimeout(() => {
            const elementToFocus = type.includes('title') ? inputRef.current : textareaRef.current;
            if (elementToFocus) {
                elementToFocus.focus();
                if (operation !== 'add') {
                    const contentLength = state.currentContent.length;
                    elementToFocus.setSelectionRange(contentLength, contentLength);
                }
            }
        }, 0);
    }, [type, operation, state.currentContent]);

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const newValue = event.target.value;
            validateContent(newValue);
            setState((prevState) => ({ ...prevState, currentContent: newValue }));
        },
        [validateContent],
    );

    const handleBlur = useCallback(() => {
        clearState();
    }, [clearState]);

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
