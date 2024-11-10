'use client';

import { Draggable } from '@hello-pangea/dnd';
import Link from 'next/link';

import type { CardProps } from '@/types/card';

import styles from './card.module.scss';

export const Card = ({ card, index }: CardProps) => (
    <Draggable draggableId={card.id} index={index}>
        {(provided) => (
            <div
                ref={provided.innerRef}
                className={styles.card}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
            >
                <Link href={`/card/${card.id}`} className={styles.link}>
                    <h3 className={styles.title}>{card.title}</h3>
                </Link>
            </div>
        )}
    </Draggable>
);
