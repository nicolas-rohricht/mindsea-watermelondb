const { DateTime, Settings } = require("luxon");
const { TsuModel, Tsu } = require("../models/TsuModel");

Settings.defaultZone = "utc"

const getSafeLastPulledAt = (req) => {
  const lastPulledAt = req.query.lastPulledAt

  if (lastPulledAt !== 'null') {
    return DateTime.fromMillis(parseInt(lastPulledAt)).toString()
  }

  return DateTime.fromMillis(1).toString()
}

exports.pull = async (req, res) => {
  try {
    const changes = req.body

    console.log('SERVER RECEIVED - CREATED', changes.tsus.created)
    console.log('SERVER RECEIVED - UPDATED', changes.tsus.updated)
    console.log('SERVER RECEIVED - DELETED', changes.tsus.deleted)
    console.log('')
    console.log('-----------')
    console.log('')

    if (changes.tsus.created.length > 0) {
      await TsuModel.create(changes.tsus.created.map(remoteEntry => ({
        from: remoteEntry.from,
        to: remoteEntry.to,
        watermelonId: remoteEntry.id,
        created_at: Date.now()
      }) ))
    }

    if (changes.tsus.updated.length > 0) {
      const updateRecords = changes.tsus.updated.map(remoteEntry => {

        return TsuModel.updateOne({watermelonId: remoteEntry.id}, {
          from: remoteEntry.from,
          to: remoteEntry.to,
          updated_at: Date.now()
        })
      }) 

      await Promise.all(updateRecords)
    }
    
    if (changes.tsus.deleted.length > 0) {
      const deletedRecords = changes.tsus.deleted.map(deletedId => {
        return TsuModel.updateOne({watermelonId: deletedId}, {
          deleted: true,
          deleted_at: Date.now()
        })
      }) 

      await Promise.all(deletedRecords)
    }
    
    res.sendStatus(200)
  } catch(e) {
    console.log('pull error', e)
    res.sendStatus(500)
  }
}

exports.push = async (req, res) => {
  try {
    const lastPulledAt = getSafeLastPulledAt(req)

    const created = []

    const updated = await TsuModel
      .aggregate([
        { $project: { id:"$watermelonId", from:"$from" , to:"$to", updated_at:"$updated_at", deleted: "$deleted" }},
        { $match: { updated_at: { $gt: DateTime.fromISO(lastPulledAt) }, deleted: false } }
      ])     
       
    let deleted = await TsuModel
      .aggregate([
        { $project: { id:"$watermelonId", deleted_at:"$deleted_at", deleted: "$deleted" }},
        { $match: { deleted_at: { $gt: DateTime.fromISO(lastPulledAt) }, deleted: true } }
      ])
      
    deleted = deleted.map(({id}) => id )

    const timestamp = Date.now()

    console.log('SENDING THIS TO THE CLIENT: created', created)
    console.log('SENDING THIS TO THE CLIENT: updated', updated)
    console.log('SENDING THIS TO THE CLIENT: deleted', deleted)
    console.log('')
    console.log('-----------')
    console.log('')
    
    res.send({
      changes: {
        tsus: {
          created,
          updated, 
          deleted
        }
      }, 
      timestamp
    })
  }
  catch(e) {
    console.log('push error e: ', e)
  }
}