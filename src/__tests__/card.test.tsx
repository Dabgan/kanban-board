import { DragDropContext, Droppable } from '@hello-pangea/dnd';

import { Card } from '@/components/card/card';
import { TEST_CARD } from '@/test/test-data';
import { render, screen } from '@/test/test-utils';

const CardWrapper = ({ children }: { children: React.ReactNode }) => (
    <DragDropContext onDragEnd={() => null}>
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

const setup = () => {
    const view = render(
        <CardWrapper>
            <Card card={TEST_CARD} index={0} />
        </CardWrapper>,
    );
    return {
        ...view,
    };
};

test('renders card with provided title', async () => {
    setup();

    const cardTitle = await screen.findByText(TEST_CARD.title);
    expect(cardTitle).toBeInTheDocument();
});

test('creates correct link to card details page', async () => {
    setup();

    const cardLink = await screen.findByRole('link');
    expect(cardLink).toHaveAttribute('href', `/card/${TEST_CARD.id}`);
});
