import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import colors from '../config/colors'

export default function playerStatsMoreInfo(type,typeName) {
    return (
        <View style={styles.container}>
           <View style={styles.titleAndImage}>
                
           </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
      },
      titleAndImage:{

      }
})
