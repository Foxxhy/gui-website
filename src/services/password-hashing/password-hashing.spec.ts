import { servicePasswordHashing } from './password-hashing'

describe('servicePasswordHashing', () => {
    it('hashes and verifies a password', async () => {
        const stored = await servicePasswordHashing.hashPassword('test-password-123')
        await expect(servicePasswordHashing.verifyPassword('test-password-123', stored)).resolves.toBe(true)
    })

    it('rejects an incorrect password', async () => {
        const stored = await servicePasswordHashing.hashPassword('test-password-123')
        await expect(servicePasswordHashing.verifyPassword('wrong-password', stored)).resolves.toBe(false)
    })

    it('rejects malformed stored hashes', async () => {
        await expect(servicePasswordHashing.verifyPassword('test-password-123', 'invalid')).resolves.toBe(false)
    })

    it('produces different hashes for the same password', async () => {
        const first = await servicePasswordHashing.hashPassword('same-password')
        const second = await servicePasswordHashing.hashPassword('same-password')
        expect(first).not.toBe(second)
        await expect(servicePasswordHashing.verifyPassword('same-password', first)).resolves.toBe(true)
        await expect(servicePasswordHashing.verifyPassword('same-password', second)).resolves.toBe(true)
    })
})
