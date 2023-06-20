export type Task<R = void> = () => R | Promise<R>
interface TaskRecord<R> {
    resolver: (result: R) => void
    rejector: (err: any) => void
    task: Task<R>
}
export class Dispatcher {
    private tasks: TaskRecord<any>[] = []
    private idle = true

    async allDone(): Promise<void> {
        return await this.invoke(() => {
            // do nothing
        })
    }

    async invoke<R>(task: Task<R>): Promise<R> {
        let resolver: (result: R) => void
        let rejector: (err: any) => void
        const promise = new Promise<R>((resolve, reject) => {
            resolver = resolve
            rejector = reject
        })
        this.tasks.push({
            task,
            rejector: rejector!,
            resolver: resolver!,
        })
        this.go()
        return promise
    }

    private async go() {
        if (this.idle) {
            this.idle = false
            while (this.tasks.length > 0) {
                const task = this.tasks.shift()!
                try {
                    const r = await task.task()
                    task.resolver(r)
                } catch (err) {
                    task.rejector(err)
                }
            }
            this.idle = true
        }
    }
}
