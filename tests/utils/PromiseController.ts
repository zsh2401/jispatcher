export type PromiseStatus = 'pending' | 'resolved' | 'rejected'
/**
 * Controlling promise from external places
 * @author zsh2401
 */
export class PromiseController<T> {
    public readonly promise: Promise<T>
    private _resolve!: (data: T) => void
    private _reject!: (reason: any) => void
    private _status: PromiseStatus = 'pending'
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve
            this._reject = reject
        })
    }
    getStatus(): PromiseStatus {
        return this._status
    }
    asPromise(): Promise<T> {
        return this.promise
    }
    resolve(data: T) {
        this._status = 'resolved'
        this._resolve(data)
    }
    reject(reason: any) {
        this._status = 'rejected'
        this._reject(reason)
    }
}
