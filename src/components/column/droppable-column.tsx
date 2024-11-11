'use client';

import { Droppable } from '@hello-pangea/dnd';

import { Card } from '@/components/card/card';
import type { Card as CardType } from '@/types/card';

import styles from './column.module.scss';
type DroppableColumnProps = {
    columnId: string;
    columnTitle: string;
    cards: CardType[];
};

export const DroppableColumn = ({ columnId, columnTitle, cards }: DroppableColumnProps) => (
    <Droppable droppableId={columnId}>
        {(dropProvided) => (
            <div
                ref={dropProvided.innerRef}
                aria-label={`Cards in ${columnTitle}`}
                className={styles.content}
                {...dropProvided.droppableProps}
            >
                {cards.map((columnCard, cardIndex) => (
                    <Card key={columnCard.id} card={columnCard} index={cardIndex} />
                ))}
                {dropProvided.placeholder}
            </div>
        )}
    </Droppable>
);
