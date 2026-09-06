'use server'

import { serviceContact } from '@/services'
import type { IActionResult } from '@/types'

export const actionSubmitContact = async (
    _previousState: IActionResult | undefined,
    formData: FormData
): Promise<IActionResult> => serviceContact.submit(formData)
