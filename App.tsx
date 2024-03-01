import { Alert, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {ST_PK} from '@env'
import { StripeProvider } from '@stripe/stripe-react-native';
import PaymentScreen from './src/PaymentScreen';

const App = () => {
  
  return (
    <View style={styles.container}>
       <StripeProvider
      publishableKey={ST_PK}
      merchantIdentifier="merchant.identifier" // required for Apple Pay
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    >
      <PaymentScreen />
    </StripeProvider>
    </View>
  )
}

export default App

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white'
  }
})