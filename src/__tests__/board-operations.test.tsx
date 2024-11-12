import { userEvent } from '@testing-library/user-event';
import { toast } from 'react-hot-toast';

import { Board } from '@/components/board/board';
import { TEST_CARD, TEST_COLUMN, TEST_NEW_COLUMN } from '@/test/test-data';
import { render, screen } from '@/test/test-utils';
import type { Column } from '@/types/column';

jest.mock('react-hot-toast', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock('../services/api-client', () => ({
    apiClient: {
        columns: {
            create: jest.fn().mockImplementation(() => ({
                data: TEST_NEW_COLUMN,
            })),
            getAll: jest.fn().mockImplementation(() => ({
                data: [],
            })),
            delete: jest.fn().mockImplementation(() => ({
                data: {},
            })),
        },
        cards: {
            create: jest.fn().mockImplementation(() => ({
                data: TEST_CARD,
            })),
        },
    },
}));

const setup = (initialColumns?: Column[]) => {
    const user = userEvent.setup();
    const view = render(<Board />, {
        initialColumns: initialColumns ?? [],
    });

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
        name: /New column title/i,
    });
    await user.type(columnTitleInput, TEST_NEW_COLUMN.title);
    await user.keyboard('{Enter}');

    const newColumn = await screen.findByText(TEST_NEW_COLUMN.title);

    expect(newColumn).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith('Column created successfully');
});

test('adds new card to existing column', async () => {
    const { user } = setup([TEST_COLUMN]);

    const addCardButton = await screen.findByRole('button', {
        name: /add new card/i,
    });
    await user.click(addCardButton);

    const cardTitleInput = await screen.findByRole('textbox', {
        name: /new card title/i,
    });
    await user.type(cardTitleInput, TEST_CARD.title);
    await user.keyboard('{Enter}');

    const newCard = await screen.findByText(TEST_CARD.title);

    expect(newCard).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith('Card created successfully');
});

test('deletes column with confirmation', async () => {
    const { user } = setup([TEST_COLUMN]);

    const deleteButton = await screen.findByRole('button', {
        name: /delete test column column/i,
    });
    await user.click(deleteButton);

    expect(screen.queryByText(TEST_COLUMN.title)).not.toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith('Column deleted successfully');
});
