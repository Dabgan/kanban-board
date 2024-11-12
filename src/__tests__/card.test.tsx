import { DragDropContext, Droppable } from '@hello-pangea/dnd';

import { Card } from '@/components/card/card';
import { render, screen } from '@/test/test-utils';
import type { Card as CardType } from '@/types/card';

const CardWrapper = ({ children }: { children: React.ReactNode }) => (
    <DragDropContext
        onDragEnd={() => {
            return null;
        }}
    >
        <Droppable droppableId="test-droppable">
            {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                    {children}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </DragDropContext>
);

const setup = (cardData: CardType) => {
    const view = render(
        <CardWrapper>
            <Card card={cardData} index={0} />
        </CardWrapper>,
    );
    return {
        ...view,
    };
};

test('renders card with provided title', () => {
    const mockCardData: CardType = {
        id: 'card-1',
        title: 'Test Card',
        description: 'Test Description',
        columnId: 'column-1',
        order: 1,
    };

    setup(mockCardData);
    expect(screen.getByText('Test Card')).toBeInTheDocument();
});

test('creates correct link to card details page', () => {
    const mockCardData: CardType = {
        id: 'card-1',
        title: 'Test Card',
        description: 'Test Description',
        columnId: 'column-1',
        order: 1,
    };

    setup(mockCardData);
    const cardLink = screen.getByRole('link');
    expect(cardLink).toHaveAttribute('href', `/card/${mockCardData.id}`);
});
