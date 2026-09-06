import 'server-only'

export const toDocumentId = (id: string): string => id

export const fromDocument = <T extends { _id: string }>(document: T): Omit<T, '_id'> & { id: string } => {
    const { _id, ...rest } = document
    return { ...rest, id: _id }
}

export const toDocument = <T extends { id: string }>(entity: T): Omit<T, 'id'> & { _id: string } => {
    const { id, ...rest } = entity
    return { ...rest, _id: id }
}
