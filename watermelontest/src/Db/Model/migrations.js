import { createTable, schemaMigrations, addColumns } from "@nozbe/watermelondb/Schema/migrations";

export default schemaMigrations({
  migrations: [
    // {
    //   toVersion: 4,
    //   steps: [
    //     addColumns({
    //       table: 'tsus',
    //       columns: [
    //         { name: 'deleted', type: 'boolean'},
    //         { name: 'updated_at', type: 'number'},
    //         { name: 'deleted_at', type: 'number'}
    //       ]
    //     })
    //   ] 
    // },
    {
      toVersion: 3,
      steps: [
        addColumns({
          table: 'tsus',
          columns: [
            { name: 'created_at', type: 'number'}
          ]
        })
      ] 
    },
    {
      toVersion: 2,
      steps: [
        createTable({
          name: 'houses',
          columns: [
            { name: 'house_name', type: 'string'},
            { name: 'house_color', type: 'string'},
          ]
        })
      ]
    }
  ]
})