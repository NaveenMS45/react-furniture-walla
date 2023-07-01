const dotenv = require('dotenv')
dotenv.config()
const stripe = require("stripe")(
  "sk_test_51Ljv2ZSH2dd0UPu9Vo2l87zDHWFyKHGkbQCQlngMGOINQtVt4j4PUrHaU4h7WpBzz4iCyTD4Em5JC1BLxQbi5WVp00NjzHyQIj"
);
exports.handler = async function (event, context) {
  const { shipping_fee, total_amount } = JSON.parse(event.body)

  const calculateOrderAmount = () => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return shipping_fee + total_amount
  }
  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(),
      currency: 'usd',
    })
    return {
      statusCode: 200,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }
}
