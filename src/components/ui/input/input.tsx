import { type ChangeEvent, forwardRef, useState } from 'react';

import { ErrorMessage } from '@/components/ui/error-message/error-message';
import type { InputProps, ValidationState } from '@/types/input';
import { hasSpecialCharacters } from '@/utils/sanitization';
import { combineClassNames } from '@/utils/style-utils';

import styles from './input.module.scss';

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ 'aria-label': ariaLabel, className = '', error, id, onChange, onBlur, type = 'text', ...props }, ref) => {
        const [validationState, setValidationState] = useState<ValidationState>({
            error: null,
            isValid: true,
        });

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            const inputValue = event.target.value;
            const hasInvalidChars = hasSpecialCharacters(inputValue);

            const newValidationState: ValidationState = {
                error: hasInvalidChars ? 'Special characters are not allowed' : null,
                isValid: !hasInvalidChars,
            };

            setValidationState(newValidationState);

            onChange?.({
                ...event,
                target: {
                    ...event.target,
                    validity: {
                        ...event.target.validity,
                        valid: newValidationState.isValid,
                    },
                },
            });
        };

        const inputClassName = combineClassNames(
            styles.input,
            (error ?? validationState.error) ? styles.error : '',
            className,
        );

        const errorMessage = error ?? validationState.error;

        return (
            <div aria-labelledby={id ? `${id}-label` : undefined} role="group">
                <input
                    ref={ref}
                    aria-invalid={Boolean(errorMessage)}
                    aria-label={ariaLabel}
                    className={inputClassName}
                    id={id}
                    type={type}
                    onBlur={onBlur}
                    onChange={handleChange}
                    {...props}
                />
                {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
            </div>
        );
    },
);

Input.displayName = 'Input';
