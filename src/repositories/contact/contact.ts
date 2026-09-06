import type { IActionResult, IContactFormConfiguration } from '@/types'

export interface IContactRepository {
    getConfiguration(): IContactFormConfiguration
    updateConfiguration(values: Partial<IContactFormConfiguration>): IActionResult<IContactFormConfiguration>
    saveSubmission(values: Record<string, string>): void
}
