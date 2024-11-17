import type { ChangeEvent, KeyboardEvent, RefObject } from 'react';

export type ContentType = 'title' | 'card-title' | 'description';

export type EditableContentProps = {
    ariaLabel: string;
    content: string;
    onUpdate: (newContent: string) => Promise<void>;
    operation?: 'add' | 'edit';
    placeholder?: string;
    type: ContentType;
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
    handleBlur: () => void;
    handleChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleContentClick: () => void;
    handleEdit: () => Promise<void>;
    handleKeyDown: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => Promise<void>;
};

export type UseEditableContentReturn = {
    state: EditableContentState;
    handlers: EditableContentHandlers;
    refs: EditableContentRefs;
    operation?: EditableContentProps['operation'];
};

export type FieldType = 'input' | 'textarea';

type CommonFieldProps = {
    ariaLabel: string;
    hasError: boolean;
    placeholder: string;
    value: string;
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
