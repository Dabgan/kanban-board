import { render, screen } from '@testing-library/react';
import React from 'react';

import { Button } from './button';

it('renders button with children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
});
