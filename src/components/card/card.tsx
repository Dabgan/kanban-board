'use client';

import { Draggable } from '@hello-pangea/dnd';
import Link from 'next/link';

import type { CardComponentProps } from '@/types/card';

import styles from './card.module.scss';

export const Card = ({ card, index }: CardComponentProps) => (
    <Draggable draggableId={card.id} index={index}>
        {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={styles.wrapper}
                role="button"
                tabIndex={0}
                aria-label={`${card.title} card`}
            >
                <Link
                    href={`/card/${card.id}`}
                    className={styles.card}
                    data-is-dragging={snapshot.isDragging}
                    onClick={(e) => {
                        if (snapshot.isDragging) {
                            e.preventDefault();
                        }
                    }}
                >
                    <h3 className={styles.title}>{card.title}</h3>
                </Link>
            </div>
        )}
    </Draggable>
);
