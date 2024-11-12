import { userEvent } from '@testing-library/user-event';
import { type AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'react-hot-toast';

import CardDetailPage from '@/app/card/[id]/page';
import { apiClient } from '@/services/api-client';
import { TEST_CARD, TEST_COLUMN } from '@/test/test-data';
import { render, screen } from '@/test/test-utils';

const user = userEvent.setup();

// Mock router with proper types
const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
} as unknown as AppRouterInstance;

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
}));

jest.mock('react-hot-toast', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock('../services/api-client', () => ({
    apiClient: {
        cards: {
            getById: jest.fn().mockImplementation(() => ({
                data: TEST_CARD,
            })),
            update: jest.fn().mockImplementation(() => ({
                data: {
                    ...TEST_CARD,
                    title: 'Updated Title',
                },
            })),
            delete: jest.fn().mockImplementation(() => ({
                data: {},
            })),
        },
        columns: {
            getAll: jest.fn().mockImplementation(() => ({
                data: [TEST_COLUMN],
            })),
        },
    },
}));

const setup = () => {
    const view = render(
        <CardDetailPage
            params={{
                id: TEST_CARD.id,
            }}
        />,
        {
            initialCards: [TEST_CARD],
            initialColumns: [TEST_COLUMN],
        },
    );
    return {
        ...view,
    };
};

test('updates card title', async () => {
    setup();

    const titleElement = await screen.findByRole('heading', {
        name: TEST_CARD.title,
    });
    await user.click(titleElement);

    const titleInput = await screen.findByRole('textbox', {
        name: /edit card title/i,
    });
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Title');
    await user.keyboard('{Enter}');

    const updatedTitle = await screen.findByRole('heading', {
        name: 'Updated Title',
    });
    expect(updatedTitle).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith('Title updated successfully');
});

test('updates card description', async () => {
    setup();

    const descriptionButton = await screen.findByRole('button', {
        name: /edit card description/i,
    });
    await user.click(descriptionButton);

    const descriptionTextarea = await screen.findByRole('textbox', {
        name: /edit card description/i,
    });
    await user.type(descriptionTextarea, 'New description');

    await user.keyboard('{Control>}{Enter}{/Control}');

    const updatedDescription = await screen.findByText('New description');
    expect(updatedDescription).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith('Description updated successfully');
});

test('deletes card and redirects to board', async () => {
    setup();

    const deleteButton = await screen.findByRole('button', {
        name: /delete card/i,
    });
    await user.click(deleteButton);

    await user.click(deleteButton);

    expect(apiClient.cards.delete).toHaveBeenCalledWith(TEST_CARD.id);
    expect(toast.success).toHaveBeenCalledWith('Card deleted successfully');
    expect(mockRouter.push).toHaveBeenCalledWith('/');
});

test('shows column name where card belongs', async () => {
    setup();

    const columnInfo = await screen.findByText(`Column: ${TEST_COLUMN.title}`);
    expect(columnInfo).toBeInTheDocument();
});

test('navigates back to board when clicking back button', async () => {
    setup();

    const backButton = await screen.findByRole('button', {
        name: /go back/i,
    });
    await user.click(backButton);

    expect(mockRouter.back).toHaveBeenCalled();
});
