export type RouteError = {
    message: string;
};

export type ApiResponse<T> = {
    data?: T;
    error?: RouteError;
};
