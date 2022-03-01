export class Log {
    constructor(private readonly prefix: string) {}

    error(msg: string, err?: any) {
        if (typeof err !== 'undefined') {
            console.error(`[${this.prefix}] ERROR: ${msg} - ${err}`, err);
        } else {
            console.error(`[${this.prefix}] ERROR: ${msg}`);
        }
    }

    info(msg: string) {
        console.log(`[${this.prefix}] ${msg}`);
    }
}
