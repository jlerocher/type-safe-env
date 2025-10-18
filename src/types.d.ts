declare type Env = {
    readonly DATABASE_URL: string;
    readonly APP_NAME: string;
    readonly API_PORT: number;
    readonly API_KEY: string;
    readonly NODE_ENV: string;
    readonly HTTPS_ENABLED: boolean;
};
