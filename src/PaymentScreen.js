import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { CardField, createToken, confirmPayment } from '@stripe/stripe-react-native';
import confirmpaymentintent from './StripeApi';
const PaymentScreen = () => {
    const [cardInfo, setcardInfo] = useState(null);
    const [isdisabled, setisdisabled] = useState(true)
    const fetchcarddetails = (cardDetails) => {
        if (cardDetails.complete) {
            setcardInfo(cardDetails)
            setisdisabled(false)
        }
        else {
            setcardInfo(null)
            setisdisabled(true)
        }
    }

    const OnDone = async () => {
        let Apidata = {
            amount: 2000,
            currency: 'usd'
        };
    
        try {
            const res = await confirmpaymentintent(Apidata);
            console.log("Payment Intent Create Successfully", res);
    
            if (res?.paymentIntent) {
                try {
                    let confirmPaymentIntent = await confirmPayment(res?.paymentIntent, { paymentMethodType: 'Card' });
                    console.log("Confirm Payment", confirmPaymentIntent);
    
                    if (confirmPaymentIntent.error) {
                        switch (confirmPaymentIntent.error.declineCode) {
                            case 'insufficient_funds':
                                Alert.alert("Payment Unsuccessful", "Your card has insufficient funds");
                                break;
                            default:
                                Alert.alert("Payment Unsuccessful", "An error occurred during payment");
                        }
                    } else {
                        Alert.alert("Payment Successful", "Your payment was successful!");
                    }
                } catch (error) {
                    console.log("Error raised at confirming payment", error);
                    Alert.alert("Payment Unsuccessful", "An error occurred during payment confirmation");
                }
            }
        } catch (error) {
            console.log("Error raised on creating payment intent", error);
            Alert.alert("Payment Unsuccessful", "An error occurred during payment intent creation");
        }
    };
    return (
        <View style={styles.container}>
            <CardField
                postalCodeEnabled={false}
                placeholders={{
                    number: '4242 4242 4242 4242',
                }}
                cardStyle={{
                    backgroundColor: '#FFFFFF',
                    textColor: '#000000',
                }}
                style={{
                    width: '100%',
                    height: 50,
                    marginVertical: 30,
                }}
                onCardChange={(cardDetails) => {
                    fetchcarddetails(cardDetails)
                }}
                onFocus={(focusedField) => {
                    console.log('focusField', focusedField);
                }}
            />

            <TouchableOpacity style={{
                ...styles.btn,
                backgroundColor: isdisabled ? 'grey' : "#CF4514",
            }}
                onPress={() => OnDone()} disabled={!cardInfo}>
                <Text style={styles.text}>Done</Text>
            </TouchableOpacity>
        </View>
    )
}

export default PaymentScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
        alignItems: 'center',
        justifyContent: "center"
    },

    btn: {

        width: '90%',
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    text: {
        fontSize: 18,
        color: 'white',
        fontWeight: "bold"
    }
})