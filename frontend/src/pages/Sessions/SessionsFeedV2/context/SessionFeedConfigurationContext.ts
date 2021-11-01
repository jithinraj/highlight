import { createContext } from '@util/context/context';

export const dateTimeFormats = [
    'Relative',
    'Date Only',
    'Date and Time',
    'Date and Time with Milliseconds',
    'Unix',
    'Unix With Milliseconds',
    'ISO',
] as const;

export type SESSION_FEED_DATETIME_FORMAT = typeof dateTimeFormats[number];

export interface SessionFeedConfigurationContext {
    datetimeFormat: SESSION_FEED_DATETIME_FORMAT;
    setDatetimeFormat: (
        newDatetimeFormat: SESSION_FEED_DATETIME_FORMAT
    ) => void;
}

export const [
    useSessionFeedConfigurationContext,
    SessionFeedConfigurationContextProvider,
] = createContext<SessionFeedConfigurationContext>(
    'SessionFeedConfigurationContext'
);