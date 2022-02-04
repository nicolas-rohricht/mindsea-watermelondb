import React from 'react'
import { Text, StyleSheet, View, Button } from 'react-native'

import withObservables from '@nozbe/with-observables'

const TsuItem = ({tsu, onPressEdit}) => (
  <View style={styles.wrapper}>
    <View style={styles.description}>
      <Text style={styles.tsuContent}>From: <Text style={styles.tsuNumber}>{tsu.from}</Text></Text>
      <Text style={styles.tsuContent, styles.tsuTo}>To: <Text style={styles.tsuNumber}>{tsu.to}</Text></Text>
    </View>
    <View style={styles.buttonsWrapper}>
      <Button title='Edit' onPress={() => onPressEdit(tsu)} />
      <Button onPress={() => tsu.deleteTsu()} title='Delete' color='#FE5834' />
    </View>
  </View>
)

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginTop: 15,
    flex: 1
  }, 
  tsuContent: {
    fontWeight: 'bold'
  },
  tsuTo: {
    marginLeft: 30,
    fontWeight: 'bold'
  },
  tsuNumber: {
    fontSize: 24,
    fontWeight: 'normal'
  },
  description: {
    flex: 2,
    flexDirection: 'row'
  },
  buttonsWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
})

const enhance = withObservables(['tsu'], ({ tsu }) => ({tsu}) )
const EnhancedTsu = enhance(TsuItem)

export default EnhancedTsu
