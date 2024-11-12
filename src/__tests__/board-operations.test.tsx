import { userEvent } from '@testing-library/user-event';
import { toast } from 'react-hot-toast';

import { Board } from '@/components/board/board';
import { apiClient } from '@/services/api-client';
import { render, screen } from '@/test/test-utils';

// Mock the toast library
jest.mock('react-hot-toast', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

// Mock the API client
jest.mock('../services/api-client', () => ({
    apiClient: {
        columns: {
            create: jest.fn().mockResolvedValue({
                data: {
                    id: 'col-1',
                    title: 'New Column',
                    order: 1,
                    cardIds: [],
                },
            }),
            getAll: jest.fn().mockResolvedValue({
                data: [],
            }),
        },
    },
}));

const setup = () => {
    const user = userEvent.setup();
    const view = render(<Board />);

    return {
        user,
        ...view,
    };
};

test('adds new column to board', async () => {
    const { user } = setup();
    const addButton = await screen.findByRole('button', {
        name: /add new column/i,
    });

    await user.click(addButton);

    const columnTitleInput = await screen.findByRole('textbox', {
        name: /new column title/i,
    });
    await user.type(columnTitleInput, 'New Column');
    await user.keyboard('{Enter}');

    const newColumn = await screen.findByText('New Column');

    expect(newColumn).toBeInTheDocument();
    expect(apiClient.columns.create).toHaveBeenCalledWith(
        expect.objectContaining({
            title: 'New Column',
            cardIds: [],
        }),
    );

    expect(toast.success).toHaveBeenCalledWith('Column created successfully');
});
