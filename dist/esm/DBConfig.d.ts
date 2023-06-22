export declare class DBConfig {
    host: string;
    port: number;
    user: string;
    pass: string;
    handles: Map<string, any>;
    constructor({ host, port, user, pass, }: {
        host: string;
        port: number;
        user: string;
        pass: string;
    });
    testConnection(): Promise<void>;
    getDatabaseHandle(db_name: string, config?: {
        ssl?: boolean;
        pool?: {
            min: number;
            max: number;
        };
    }): any;
    destroy(db_name?: string): void;
}
