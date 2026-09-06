import { Badge, type badgeVariants } from '@/components/ui/badge'
import type { ITag, ITagStyle } from '@/types'
import type { VariantProps } from 'class-variance-authority'

type TagBadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>

const tagStyleVariants: Record<ITagStyle, TagBadgeVariant> = {
    green: 'green',
    blue: 'blue',
    purple: 'purple',
    red: 'destructive',
    yellow: 'secondary',
}

export const getTagBadgeVariant = (style: ITagStyle): TagBadgeVariant =>
    tagStyleVariants[style] ?? 'secondary'

export const TagBadge = ({ tag }: { tag: ITag }) => (
    <Badge variant={getTagBadgeVariant(tag.style)}>{tag.name}</Badge>
)

export const ArticleTags = ({ tags }: { tags?: ITag[] }) =>
    tags?.length ? (
        <ul className="flex flex-wrap gap-2" aria-label="Tags de l’article">
            {tags.map((tag) => (
                <li key={tag.id}>
                    <TagBadge tag={tag} />
                </li>
            ))}
        </ul>
    ) : null
