import { render, screen } from '@testing-library/react';

test('renders homepage', () => {
    render(<div>Hello</div>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
});
