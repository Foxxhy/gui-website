export interface IMedia {
  id: string
  filename: string
  mimeType: string
  filesize: number
  width?: number
  height?: number
  alt: string
  caption?: string
  credit?: string
  url: string
}