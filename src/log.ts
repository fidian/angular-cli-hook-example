export class Log {
    constructor(private readonly prefix: string) {}

    info(msg: string) {
        console.log(`[${this.prefix}] ${msg}`);
    }
}
