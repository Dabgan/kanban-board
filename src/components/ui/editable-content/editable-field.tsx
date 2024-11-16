import { type ReactElement } from 'react';

import { EDITABLE_CONTENT_CONSTANTS } from '@/constants/editable-content';
import type { EditableFieldProps } from '@/types/editable-content';
import { combineClassNames } from '@/utils/style-utils';

import styles from './editable-content.module.scss';

const getFieldClassName = (fieldType: EditableFieldProps['fieldType'], hasError: boolean) =>
    combineClassNames(fieldType === 'input' ? styles.input : styles.textarea, hasError ? styles.error : null);

export const EditableField = (props: EditableFieldProps): ReactElement => {
    const { fieldType, fieldRef, ariaLabel, value, hasError, onBlur, onChange, onKeyDown } = props;

    const commonProps = {
        'aria-label': ariaLabel,
        className: getFieldClassName(fieldType, hasError),
        value,
        onBlur,
        onChange,
        onKeyDown,
    };

    if (fieldType === 'input') {
        return <input {...commonProps} ref={fieldRef} />;
    }

    return (
        <>
            <textarea {...commonProps} ref={fieldRef} rows={EDITABLE_CONTENT_CONSTANTS.ROWS} />
            <p className={styles.hint}>{EDITABLE_CONTENT_CONSTANTS.TEXTAREA_HINT}</p>
        </>
    );
};
