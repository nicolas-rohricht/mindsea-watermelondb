import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Switch,
  Keyboard,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import {useNetInfo} from "@react-native-community/netinfo";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { mySync } from './src/Db/db';

import { TsuList } from './src/components';
import TsuDAO from './src/Db/DAO/TsuDAO';

const CreationArea = memo(({tsuFrom, onChangeFrom, tsuTo, onChangeTo, submitForm}) => {
  const tsuToRef = useRef(null)
  
  return (
    <>
      <Text style={{ fontSize: 34, color: 'black'}}>Creation area</Text>

      <Text>TSU From</Text>
      <TextInput 
        value={tsuFrom}
        onChangeText={onChangeFrom}
        placeholder='type the first TSU code in the box'
        style={styles.textInput}
        returnKeyType='next'
        onSubmitEditing={() => tsuToRef.current.focus()}
        blurOnSubmit={false}
      />

      <Text>TSU To</Text>
      <TextInput 
        ref={tsuToRef}
        value={tsuTo}
        onChangeText={onChangeTo}
        placeholder='type the last TSU code in the box'
        style={styles.textInput}
        onSubmitEditing={() => submitForm()}
      />
    </>
  )
})

const ConnectionStatus = memo(({netInfo}) => (
  <Text style={{
    marginBottom: 15, 
    fontSize: 26, 
    textAlign: 'center',
    color: netInfo.isConnected ? 'green' : 'red',
    fontWeight: 'bold'
  }}>{`You're ${netInfo.isConnected ? 'online': 'offline'}`}</Text>
))

const App = () => {
  const [tsuFrom, setTsuFrom] = useState('')
  const [tsuTo, setTsuTo] = useState('')
  const [editingTsu, setEditingTsu] = useState(null)
  const [autoUpdate, setAutoUpdate] = useState(false)
  const [syncInProgress, setSyncInProgress] = useState(false)

  const netInfo = useNetInfo()

  async function sync() {
    setSyncInProgress(true)
    await mySync()
    setSyncInProgress(false)
  }

  useEffect(() => {
    if (netInfo.isConnected && autoUpdate && !syncInProgress) {
      sync()
    }
  }, [netInfo, autoUpdate])

  async function _createUpdateTsu () {
    if (editingTsu) {
      await editingTsu.updateTsu(tsuFrom, tsuTo)
      setEditingTsu(null)
    } else {
      await TsuDAO.createTsu(tsuFrom, tsuTo)
    }

    Keyboard.dismiss()
    setTsuFrom('')
    setTsuTo('')
  }

  const onPressEdit = useCallback((tsu) => {
    setEditingTsu(tsu)

    const {from, to} = tsu

    setTsuFrom(from)
    setTsuTo(to)
  }, [])

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, paddingVertical: 15, paddingHorizontal: 10 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <CreationArea 
          tsuFrom={tsuFrom}
          onChangeFrom={setTsuFrom}
          tsuTo={tsuTo}
          onChangeTo={setTsuTo}
          submitForm={_createUpdateTsu}
        />

        <Button 
          title={`${editingTsu ? 'Update' : 'Add'} TSU`}
          onPress={() => _createUpdateTsu()}
          disabled={!tsuTo || !tsuFrom}
        />

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 34, color: 'black', marginTop: 20}}>TSU Inventory</Text>
          <TsuList onPressEdit={onPressEdit} />
          
        </View>

        <View>
          <ConnectionStatus netInfo={netInfo} />

          <View style={{flexDirection: 'row', marginBottom: 15, alignItems: 'center', justifyContent: 'center'}}>
            <Switch value={autoUpdate} onChange={() => setAutoUpdate(!autoUpdate)} />
            <Text style={{ marginLeft: 15 }}>Auto-update when available connection</Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            {
              syncInProgress
              ? <ActivityIndicator size={'large'} animating={syncInProgress} color='#2FCB20'/>
              : <Button 
                  title='Sync with backend'
                  onPress={() => {
                    sync()
                  }}
                  disabled={!netInfo.isConnected}
                  color='#2FCB20'
                />
            }
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  textInput: {
    borderColor: 'gray', 
    borderWidth: 0.3, 
    borderRadius: 6, 
    marginTop: 3, 
    marginBottom: 15, 
    height: 40, 
    padding: 5
  }
});

export default App;
