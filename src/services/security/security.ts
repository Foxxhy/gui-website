import 'server-only'

import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

const allowedTags = ['p', 'br', 'strong', 'em', 'del', 'blockquote', 'code', 'pre', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'a']

export const serviceSanitizeMarkdown = async (markdown: string): Promise<string> => {
    const html = await marked.parse(markdown, { async: true, breaks: true })
    return sanitizeHtml(html, {
        allowedTags,
        allowedAttributes: { a: ['href', 'title', 'rel'] },
        allowedSchemes: ['http', 'https', 'mailto'],
        allowProtocolRelative: false,
        transformTags: {
            a: (_tagName, attribs) => ({
                tagName: 'a',
                attribs: {
                    ...attribs,
                    rel: 'nofollow noopener noreferrer',
                },
            }),
        },
    })
}

export const serviceIsSafeUrl = (value: unknown): value is string => {
    if (typeof value !== 'string') return false
    try {
        const url = new URL(value, 'https://association-poc.invalid')
        return ['http:', 'https:', 'mailto:'].includes(url.protocol)
    } catch {
        return false
    }
}

export const serviceCreateCsp = (nonce: string, isDevelopment = process.env.NODE_ENV === 'development'): string => [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'${isDevelopment ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`,
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    'base-uri \'self\'',
].join('; ')

export interface IServiceUploadPolicy {
    maxBytes: number
    mimeTypes: readonly string[]
    extensions: readonly string[]
}

export const serviceValidateUploadMetadata = (
    file: { name: string; size: number; type: string },
    policy: IServiceUploadPolicy
): string | undefined => {
    const extension = file.name.toLowerCase().split('.').pop()
    if (!extension || !policy.extensions.includes(extension)) return 'Extension de fichier non autorisée.'
    if (!policy.mimeTypes.includes(file.type)) return 'Type MIME non autorisé.'
    if (file.size <= 0 || file.size > policy.maxBytes) return 'Taille de fichier non autorisée.'
    if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) return 'Nom de fichier non autorisé.'
    return undefined
}
