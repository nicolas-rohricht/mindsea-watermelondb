const mongoose = require('mongoose')

const TsuSchema = new mongoose.Schema({
  from: { type: String, required: true }, 
  to: { type: String, required: true }, 
  watermelonId: { type: String, required: true },
  deleted: {type: Boolean, default: false},
  deleted_at: { type: Date }
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})

const TsuModel = mongoose.model('Tsu', TsuSchema)

class Tsu {
  constructor() {
    this.from = ''
    this.to = ''
    this.watermelonId = ''
  }


}

module.exports={TsuModel, Tsu}