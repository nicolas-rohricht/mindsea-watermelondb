import { database } from "../db";

const tsus = database.collections.get('tsus')

export default {
  observeTsus: () => tsus.query().observe(),
  createTsu: async (from, to) => {
    await database.write(async () => {
      await tsus.create((tsu) => {
        tsu.from = from
        tsu.to = to
      })
    })
  }
}