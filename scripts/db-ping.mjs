import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { MongoClient } from 'mongodb'

const DEFAULT_DB_NAME = 'gui-website-dev'
const MONGODB_URI_PATTERN = /mongodb(\+srv)?:\/\/[^@\s]+@[^\s/]+/gi
const CREDENTIALS_PATTERN = /\/\/[^:]+:[^@]+@/g

const sanitizeMessage = (message) =>
    message
        .replace(MONGODB_URI_PATTERN, 'mongodb://[redacted]')
        .replace(CREDENTIALS_PATTERN, '//[redacted]@')

const loadEnvFile = (path) => {
    if (!existsSync(path)) return
    for (const line of readFileSync(path, 'utf8').split('\n')) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const separator = trimmed.indexOf('=')
        if (separator === -1) continue
        const key = trimmed.slice(0, separator).trim()
        let value = trimmed.slice(separator + 1).trim()
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1)
        }
        if (!(key in process.env)) process.env[key] = value
    }
}

loadEnvFile(resolve(process.cwd(), '.env'))

const uri = process.env.MONGODB_URI?.trim()
const dbName = process.env.MONGODB_DB_NAME?.trim() || DEFAULT_DB_NAME

if (!uri) {
    console.error('MONGODB_URI est requis pour tester la connexion.')
    process.exit(1)
}

try {
    const client = new MongoClient(uri)
    await client.connect()
    await client.db(dbName).command({ ping: 1 })
    await client.close()
    console.log(`Connexion MongoDB OK (base : ${dbName}).`)
} catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`Échec de connexion MongoDB : ${sanitizeMessage(message)}`)
    process.exit(1)
}
