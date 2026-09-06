import 'server-only'

export type IDataSource = 'mock' | 'mongodb'

const DEFAULT_DB_NAME = 'gui-website-dev'

const envOrDefault = (name: string, fallback: string) => {
    const value = process.env[name]?.trim()
    return value || fallback
}

const optionalEnv = (name: string) => {
    const value = process.env[name]?.trim()
    return value || undefined
}

const parseDataSource = (value: string | undefined): IDataSource => {
    if (!value || value === 'mock') return 'mock'
    if (value === 'mongodb') return 'mongodb'
    throw new Error('DATA_SOURCE doit valoir "mock" ou "mongodb".')
}

const dataSource = parseDataSource(process.env.DATA_SOURCE?.trim())

if (dataSource === 'mongodb' && !optionalEnv('MONGODB_URI')) {
    throw new Error('MONGODB_URI est requis lorsque DATA_SOURCE=mongodb.')
}

export const configDatabase = {
    dataSource,
    mongo: {
        uri: optionalEnv('MONGODB_URI'),
        dbName: envOrDefault('MONGODB_DB_NAME', DEFAULT_DB_NAME),
    },
} as const

export type IConfigDatabase = typeof configDatabase
