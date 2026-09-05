export interface ILink {
    id: string
    url: string
    label: string
    target?: '_blank' | '_self' | '_parent' | '_top'
}