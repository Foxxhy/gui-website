import { sanitizeMarkdown } from '@/services'

export const MarkdownContent = async ({ content }: { content: string }) => {
    const safeHtml = await sanitizeMarkdown(content)
    // biome-ignore lint/security/noDangerouslySetInnerHtml: safeHtml is exclusively produced by sanitizeMarkdown.
    return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
}
