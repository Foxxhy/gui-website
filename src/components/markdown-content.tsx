import { serviceSanitizeMarkdown } from '@/services'

export const MarkdownContent = async ({ content }: { content: string }) => {
    const safeHtml = await serviceSanitizeMarkdown(content)
    // biome-ignore lint/security/noDangerouslySetInnerHtml: safeHtml is exclusively produced by serviceSanitizeMarkdown.
    return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
}
