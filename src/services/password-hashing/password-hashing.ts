import 'server-only'

import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)

const HASH_PREFIX = 'scrypt'
const SALT_LENGTH = 16
const KEY_LENGTH = 64

const encodeHash = (salt: Buffer, derivedKey: Buffer): string =>
    `${HASH_PREFIX}:${salt.toString('base64url')}:${derivedKey.toString('base64url')}`

const parseStoredHash = (stored: string): { salt: Buffer; derivedKey: Buffer } | undefined => {
    const [prefix, saltValue, hashValue] = stored.split(':')
    if (prefix !== HASH_PREFIX || !saltValue || !hashValue) return undefined
    return {
        salt: Buffer.from(saltValue, 'base64url'),
        derivedKey: Buffer.from(hashValue, 'base64url'),
    }
}

export const servicePasswordHashing = {
    hashPassword: async (plain: string): Promise<string> => {
        const salt = randomBytes(SALT_LENGTH)
        const derivedKey = (await scryptAsync(plain, salt, KEY_LENGTH)) as Buffer
        return encodeHash(salt, derivedKey)
    },
    verifyPassword: async (plain: string, stored: string): Promise<boolean> => {
        const parsed = parseStoredHash(stored)
        if (!parsed) return false
        const candidate = (await scryptAsync(plain, parsed.salt, KEY_LENGTH)) as Buffer
        if (candidate.length !== parsed.derivedKey.length) return false
        return timingSafeEqual(candidate, parsed.derivedKey)
    },
}
