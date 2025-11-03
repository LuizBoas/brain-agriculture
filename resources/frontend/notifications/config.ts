import { RichNotification, SimpleNotification } from './v1';

export const NotificationTypes = {
    simple: SimpleNotification,
    rich: RichNotification
} as const;
