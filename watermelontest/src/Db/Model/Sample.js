import { Model } from "@nozbe/watermelondb";
import { relation, text, children } from '@nozbe/watermelondb/decorators'

export default class Sample extends Model {
  static table = 'samples'
  static associations = {
    tsus: {type: 'belongs_to', key: 'sample_id'}
  }

  @text('lifetime_number') lifetimeNumber
  @text('herd_management_number') herdManagementNumber
  @relation('tsus', 'tsu_id') tsu
}
