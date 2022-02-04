import { Model } from "@nozbe/watermelondb";
import { text, children, writer, readonly, date } from '@nozbe/watermelondb/decorators'

class Tsu extends Model {
  static table = 'tsus'

  static associations = {
    samples: { type: 'has_many', foreignKey: 'tsu_id' }
  }

  @text('from') from
  @text('to') to
  @children('samples') samples
  // @field('deleted') deleted
  @readonly @date('created_at') createdAt
  // @readonly @date('updated_at') updatedAt
  // @readonly @date('deleted_at') deletedAt

  @writer async updateTsu(from, to) {
    return await this.update((tsu) => {
      tsu.from = from
      tsu.to = to
    })
  }

  @writer async deleteTsu() {
    return await Promise.all([
      this.markAsDeleted()
    ])
  }
}

export {Tsu}