import 'server-only'

import { mongoPing } from '@/repositories/mongodb/ping'

export const serviceDatabase = {
    ping: async () => mongoPing(),
}
