import { cn } from '@/lib/utils'

export const VisualMock = ({
    className,
    label = 'VISUEL MOCK',
}: {
    className?: string
    label?: string
}) => (
    <div
        aria-hidden="true"
        className={cn(
            'flex aspect-[4/3] w-full items-center justify-center rounded-lg border border-pink-300 bg-pink-200 text-xs font-medium tracking-wide text-pink-900 uppercase',
            className
        )}
    >
        {label}
    </div>
)
