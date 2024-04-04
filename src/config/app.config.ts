declare interface AppConfigOptions {
    host?: string;
    port?: number;
}

export const appConfig: AppConfigOptions = {
    host: process.env.APP_HOST || 'localhost',
    port: process.env.APP_PORT ? parseInt(process.env.PORT) : 8080
}