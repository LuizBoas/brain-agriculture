export type ToastData = {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
};

export type AuthenticatedUserData = {
    id: string;
    email: string;
    name: string;
    points: number;
    streak: number;
    freeze_count: number;
    image: string | null;
    email_verified_at: string | null;
    active_frame_id: string | null;
    roles: Array<string>;
};

export type AuthData = {
    user: AuthenticatedUserData;
};
