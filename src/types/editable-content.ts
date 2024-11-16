import type { ChangeEvent, KeyboardEvent, RefObject } from 'react';

export type ContentType = 'title' | 'description';

export type EditableContentProps = {
    content: string;
    onUpdate: (newContent: string) => Promise<void>;
    ariaLabel: string;
    type: ContentType;
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

export type FieldType = 'input' | 'textarea';

type CommonFieldProps = {
    ariaLabel: string;
    value: string;
    hasError: boolean;
    onBlur: () => void;
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onKeyDown: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export type InputFieldProps = CommonFieldProps & {
    fieldType: 'input';
    fieldRef: RefObject<HTMLInputElement>;
};

export type TextareaFieldProps = CommonFieldProps & {
    fieldType: 'textarea';
    fieldRef: RefObject<HTMLTextAreaElement>;
};

export type EditableFieldProps = InputFieldProps | TextareaFieldProps;
