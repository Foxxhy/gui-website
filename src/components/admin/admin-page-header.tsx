export const AdminPageHeader = ({
    title,
    description,
}: {
    title: string
    description?: string
}) => (
    <div className="mb-6 space-y-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
)
