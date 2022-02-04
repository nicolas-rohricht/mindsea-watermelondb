import React, { memo } from 'react'
import { FlatList, Text } from 'react-native'

import withObservables from '@nozbe/with-observables'
import TsuItem from './TsuItem'
import TsuDAO from '../../Db/DAO/TsuDAO'

const TsuList = memo(({tsus, onPressEdit }) => {

return (
  <FlatList 
    data={tsus} 
    style={{flex: 1}}
    keyExtractor={(item) => item.id}
    renderItem={({item}) => 
      <TsuItem 
        onPressEdit={onPressEdit} 
        tsu={item} 
        />
    } 
  />
)
  })
  
const enhance = withObservables([''], () => ({
  tsus: TsuDAO.observeTsus()
}))

export default enhance(TsuList)
