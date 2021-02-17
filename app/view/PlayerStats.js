import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {useSelector} from 'react-redux';

export default function PlayerStats() {

    const battleLog=useSelector(state => state.battleLog)
    const lastFetch=useSelector(state => state.lastFetch)
    
    

    return (
        <View>
            <Text>Welcome to Player Stats!</Text>
        </View>
    )
}

const styles = StyleSheet.create({})
