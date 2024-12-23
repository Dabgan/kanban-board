import { useContext } from 'react';

import { CardsContext } from '@/context/cards-context';
import type { CardsContextType } from '@/types/card';

export const useCards = (): CardsContextType => {
    const context = useContext(CardsContext);
    if (!context) {
        throw new Error('useCards must be used within CardsProvider');
    }
    return context;
};
