import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { synchronize } from '@nozbe/watermelondb/sync'

import schema from './Schema';
import migrations from './Model/migrations';
import {Tsu} from './Model/Tsu'
import Sample from './Model/Sample'
import api from '../api/api';

const adapter = new SQLiteAdapter({
  schema, 
  migrations,
  jsi: true,
  onSetUpError: error => {
    console.log('database error', error)
  }
})

const database = new Database({
  adapter,
  modelClasses: [Tsu, Sample]
})

async function mySync() {
  await synchronize({
    database,
    sendCreatedAsUpdated: true,
    pullChanges: async ({lastPulledAt, schemaVersion, migration}) => {
      const urlParams = `lastPulledAt=${lastPulledAt}&schemaVersion=${schemaVersion}&migration=${encodeURIComponent(JSON.stringify(migration))}`
      const response = await api.get(`/sync?${urlParams}`)

      if (!response.ok) {
        throw new Error(await response.data.text())
      }

      const { changes, timestamp } = await response.data
      return { changes, timestamp }
    }, 
    pushChanges: async ({ changes, lastPulledAt}) => {
      const response = await api.post('/sync', changes)

      if (!response.ok) {
        throw new Error(await response.text())
      }
    }, 
    migrationsEnabledAtVersion: 1
  })
}

export { database, mySync }