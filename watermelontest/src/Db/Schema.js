import { appSchema, tableSchema } from "@nozbe/watermelondb/Schema";

export default appSchema({
  version: 3,
  tables: [
    tableSchema({
      name: 'tsus',
      columns: [
        { name: 'from', type: 'string'},
        { name: 'to', type: 'string'},
        { name: 'created_at', type: 'number' },
        // { name: 'deleted', type: 'boolean'},
        // { name: 'updated_at', type: 'number'},
        // { name: 'deleted_at', type: 'number'}
      ]
    }),
    tableSchema({
      name: 'samples',
      columns: [
        { name: 'lifetime_number', type: 'string' },
        { name: 'herd_management_number', type: 'string' },
        { name: 'tsu_id', type: 'string', isIndexed: true },
      ]
    }),
    tableSchema({
      name: 'houses',
      columns: [
        { name: 'house_name', type: 'string' },
        { name: 'house_color', type: 'string' }
      ]
    })
  ]
})