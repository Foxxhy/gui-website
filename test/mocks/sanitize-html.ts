const sanitizeHtml = (html: string): string => html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')

export default sanitizeHtml
