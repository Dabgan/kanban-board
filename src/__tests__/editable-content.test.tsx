import { userEvent } from '@testing-library/user-event';

import { EditableContent } from '@/components/ui/editable-content/editable-content';
import { render, screen } from '@/test/test-utils';

const user = userEvent.setup();

jest.mock('react-hot-toast', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const setup = () => {
    const mockUpdateContent = jest.fn().mockImplementation(() => Promise.resolve());

    const view = render(
        <EditableContent
            content="Initial Content"
            onUpdate={mockUpdateContent}
            type="title"
            tag="h2"
            ariaLabel="Edit title"
        />,
    );

    return {
        mockUpdateContent,
        ...view,
    };
};

test('displays initial content in view mode', async () => {
    setup();

    const content = await screen.findByText('Initial Content');
    expect(content).toBeInTheDocument();
});

test('updates content after editing', async () => {
    const { mockUpdateContent } = setup();

    const contentElement = await screen.findByRole('button', {
        name: /edit title/i,
    });
    await user.click(contentElement);

    const inputElement = await screen.findByRole('textbox', {
        name: /edit title/i,
    });
    await user.clear(inputElement);
    await user.type(inputElement, 'Updated Content');
    await user.keyboard('{Enter}');

    expect(mockUpdateContent).toHaveBeenCalledWith('Updated Content');
});

test('cancels editing on Escape key', async () => {
    const { mockUpdateContent } = setup();

    const contentElement = await screen.findByRole('button', {
        name: /edit title/i,
    });
    await user.click(contentElement);

    const inputElement = await screen.findByRole('textbox');
    await user.type(inputElement, 'Cancelled Content');
    await user.keyboard('{Escape}');

    const originalContent = await screen.findByText('Initial Content');
    expect(originalContent).toBeInTheDocument();
    expect(mockUpdateContent).not.toHaveBeenCalled();
});
