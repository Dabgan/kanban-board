import type { KeyboardEvent, ChangeEvent, RefObject } from 'react';

export type ContentType = 'title' | 'description';

export type EditableContentProps = {
    content: string;
    onUpdate: (newContent: string) => Promise<void>;
    ariaLabel: string;
    type: ContentType;
    tag?: 'h1' | 'h2';
    placeholder?: string;
};

export type EditableContentState = {
    isEditing: boolean;
    currentContent: string;
    validationError: string | null;
};

export type EditableContentRefs = {
    inputRef: RefObject<HTMLInputElement>;
    textareaRef: RefObject<HTMLTextAreaElement>;
};

export type EditableContentHandlers = {
    handleEdit: () => Promise<void>;
    handleKeyDown: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => Promise<void>;
    handleContentClick: () => void;
    handleChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleBlur: () => void;
};

export type UseEditableContentReturn = {
    state: EditableContentState;
    handlers: EditableContentHandlers;
    refs: EditableContentRefs;
};
