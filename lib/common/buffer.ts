export class Buffer<TEntity> {
    private callback: (entity: TEntity) => void | Promise<void>;
    private timeout: number;
    private promise: Promise<void> | null;
    private requested: boolean;

    constructor(callback: (entity: TEntity) => void | Promise<void>, timeout: number = 100) {
        this.callback = callback;
        this.timeout = timeout;
        this.promise = null;
        this.requested = false;
    }

    async set(entity: TEntity) {
        if (this.promise === null) {
            this.requested = true;
            this.promise = this.delay();
            this.callback(entity);
        } else if (this.requested) {
            this.requested = false;
            await this.promise;
            this.promise = null;
            this.callback(entity);
        }
    }

    private async delay() {
        return new Promise<void>(resolve => setTimeout(resolve, this.timeout));
    }
}