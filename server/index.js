const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const stripe = require('stripe')(process.env.SECRET_KEY)

const app = express()

app.use(bodyParser.json())

app.get('/' , (req,resp)=>{
resp.send("Hello World")
})

app.post('/payment-sheet', async (req, res) => {
    // Use an existing Customer ID if this is a returning customer.
    const {amount,currency} = req.body
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: '2023-10-16'}
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      customer: customer.id,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  });


app.listen(4000,()=>{
    console.log("Server is running on port 4000 http://localhost:4000 ")
})