import 'server-only'

type IBucket = {
    count: number
    resetAt: number
}

const buckets = new Map<string, IBucket>()

export const serviceRateLimit = {
    check: (key: string, limit: number, windowMs: number): boolean => {
        const now = Date.now()
        const bucket = buckets.get(key)

        if (!bucket || bucket.resetAt <= now) {
            buckets.set(key, { count: 1, resetAt: now + windowMs })
            return true
        }

        if (bucket.count >= limit) return false

        bucket.count += 1
        return true
    },
    reset: (key: string): void => {
        buckets.delete(key)
    },
}
