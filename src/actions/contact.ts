'use server'

import { contactService } from '@/services'
import type { IActionResult } from '@/types'

export const submitContactAction = async (
    _previousState: IActionResult | undefined,
    formData: FormData
): Promise<IActionResult> => contactService.submit(formData)