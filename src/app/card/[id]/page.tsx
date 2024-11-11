'use client';

import { BackButton } from '@/components/ui/back-button/back-button';
import { DeleteButton } from '@/components/ui/delete-button/delete-button';
import { EditableContent } from '@/components/ui/editable-content/editable-content';
import { Loading } from '@/components/ui/loading/loading';
import { useCardDetail } from '@/hooks/use-card-detail';
import { useColumns } from '@/hooks/use-columns';

import styles from './page.module.scss';

type CardDetailPageProps = {
    params: {
        id: string;
    };
};

const CardDetailPage = ({ params }: CardDetailPageProps) => {
    const [{ card, isLoading, error }, { updateTitle, updateDescription, deleteCard }] = useCardDetail(params.id);
    const {
        state: { columns },
    } = useColumns();

    if (isLoading) {
        return <Loading />;
    }

    if (!card) {
        return (
            <div className={styles.error}>
                <p className={styles['error-message']}>{error ?? 'Card not found'}</p>
                <BackButton />
            </div>
        );
    }

    const column = columns.find((columnItem) => columnItem.id === card.columnId);

    return (
        <main className={styles.container}>
            <div className={styles['card-container']}>
                <header className={styles.header}>
                    <BackButton />
                    {column && <p className={styles.column}>Column: {column.title}</p>}
                    <DeleteButton label="Delete card" onClick={deleteCard} variant="button" />
                </header>
                <div className={styles.content}>
                    <EditableContent
                        content={card.title}
                        onUpdate={updateTitle}
                        type="title"
                        tag="h1"
                        ariaLabel="Edit card title"
                        placeholder="Add title..."
                    />
                    <EditableContent
                        content={card.description ?? ''}
                        onUpdate={updateDescription}
                        type="description"
                        ariaLabel="Edit card description"
                        placeholder="Add description..."
                    />
                </div>
            </div>
        </main>
    );
};

export default CardDetailPage;
