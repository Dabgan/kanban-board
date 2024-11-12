import { render, screen } from '@/test/test-utils';
import { userEvent } from '@testing-library/user-event';
import { EditableContent } from '@/components/ui/editable-content/editable-content';

type SetupProps = {
    content: string;
    onUpdate: (newContent: string) => Promise<void>;
};

const setup = ({ content, onUpdate }: SetupProps) => {
    const user = userEvent.setup();

    const view = render(
        <EditableContent content={content} onUpdate={onUpdate} type="title" tag="h2" ariaLabel="Edit title" />,
    );

    return {
        user,
        ...view,
    };
};

test('displays initial content in view mode', () => {
    const mockUpdateContent = jest.fn();
    setup({
        content: 'Initial Content',
        onUpdate: mockUpdateContent,
    });

    expect(screen.getByText('Initial Content')).toBeInTheDocument();
});

test('updates content after editing', async () => {
    const mockUpdateContent = jest.fn();
    const { user } = setup({
        content: 'Initial Content',
        onUpdate: mockUpdateContent,
    });

    const contentElement = screen.getByText('Initial Content');
    await user.click(contentElement);

    const inputElement = screen.getByRole('textbox');
    await user.clear(inputElement);
    await user.type(inputElement, 'Updated Content');
    await user.keyboard('{Enter}');

    expect(mockUpdateContent).toHaveBeenCalledWith('Updated Content');
});
