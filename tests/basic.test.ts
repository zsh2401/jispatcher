import { Dispatcher } from "../src";
import { PromiseController } from "./utils/PromiseController"
import { sleep } from "./utils/sleep";

describe("Dispatcher basic test", () => {
    const TIMES = 10;

    it("get wrong answer without dispatcher", async () => {
        const promise = new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve()
            }, 0)
        })
        let count = 0;
        async function highConcurrencyMethod() {
            const local = count
            await promise
            count = local + 1
        }
        const promises: Promise<void>[] = []
        for (let i = 0; i < TIMES; i++) {
            promises.push(highConcurrencyMethod())
        }
        await Promise.all(promises)
        expect(count).toEqual(1)
    })

    it("get correct answer with dispatcher", async () => {
        const dispatcher = new Dispatcher()
        const promise = new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve()
            }, 0)
        })
        let count = 0;
        async function highConcurrencyMethod() {
            await dispatcher.invoke(async () => {
                const local = count
                await promise
                count = local + 1
            })
        }
        const promises: Promise<void>[] = []
        for (let i = 0; i < TIMES; i++) {
            promises.push(highConcurrencyMethod())
        }
        await Promise.all(promises)
        expect(count).toEqual(10)
    })

    it("always retrieve correct result", async () => {
        const TIMES = 10_000;
        const dispatcher = new Dispatcher()
        // const allDone
        for (let i = 0; i < TIMES; i++) {
            // expect(await )
            const local = i
            dispatcher.invoke(() => {
                return local
            }).then((result) => {
                expect(result).toBe(local)
            })
        }
    })

    it("wait until all done", async () => {
        const TIMES = 100;
        // jest will throw error when total execution exceed 5000 ms
        // thus we have to set a safe sleep time.
        const MAX_SLEEP_PER_TASK = 4500 / TIMES
        const resultList: number[] = new Array(TIMES).fill(-1)
        const dispatcher = new Dispatcher()
        for (let i = 0; i < TIMES; i++) {
            const local = i
            dispatcher.invoke(async () => {
                await sleep(Math.random() * MAX_SLEEP_PER_TASK)
                resultList[local] = local
            })
        }
        await dispatcher.allDone()
        // the final result are expected to be [0,1,2,3...,...,N-1,N]
        expect(resultList).toStrictEqual([...Array(TIMES).keys()])
    })
})