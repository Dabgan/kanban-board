export const combineClassNames = (...classNames: (string | boolean | null | undefined)[]) =>
    classNames
        .filter((className): className is string => typeof className === 'string' && className.length > 0)
        .join(' ');
