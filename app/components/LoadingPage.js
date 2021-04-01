import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function LoadingPage() {
    return (
        <View style={styles.container}>
            <Text style={{fontSize:40}} >Loading</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      margin:100,
      flex: 1,
      backgroundColor: "#1C3273",
    },
  });
  
