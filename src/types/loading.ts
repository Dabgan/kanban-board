export type LoadingState = {
    isLoading: boolean;
};

export type LoadingContextType = {
    state: LoadingState;
    setGlobalLoading: (loading: boolean) => void;
};
