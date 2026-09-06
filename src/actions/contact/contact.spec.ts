import { serviceContact } from '@/services'
import type { IActionResult } from '@/types'

import { actionSubmitContact } from './contact'

jest.mock('@/services', () => ({
    serviceContact: {
        submit: jest.fn(),
    },
}))

describe('actionSubmitContact', () => {
    it('delegates to serviceContact.submit', async () => {
        const formData = new FormData()
        formData.set('name', 'Alice')
        const result: IActionResult = {
            success: true,
            message: 'ok',
        }
        ;(serviceContact.submit as jest.Mock).mockResolvedValue(result)

        await expect(actionSubmitContact(undefined, formData)).resolves.toBe(result)
        expect(serviceContact.submit).toHaveBeenCalledWith(formData)
    })
})
