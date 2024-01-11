require('dotenv').config()

const express = require('express')
const app = express()
app.use(express.static('public'))
app.use(express.json())

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)


const storeItems = new Map([
    [1, {priceInCents: 89900, name: 'skateboard'}],
    [2, {priceInCents: 50000, name:'Soul runner Hoodie'}],
    [3, {priceInCents: 36900, name: 'Poster (katana zero)'}],
    [4, {priceInCents: 20000, name: 'Reflects M2'}],
    [5, {priceInCents: 68000, name: 'Latte Coat 1.0'}],
    [6, {priceInCents: 12000, name: 'Levi AOT shirt'}],
    [7, {priceInCents: 10000, name: 'Hasbulla key chain'}],
    [8, {priceInCents: 45000, name: 'Miasaki Iphone 11 case'}],
    [9, {priceInCents: 2000, name: 'Sus juice'}],
])

app.listen(3000)

app.post("/create-checkout-session", async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: req.body.items.map(item => {
          const storeItem = storeItems.get(item.id)
          return {
            price_data: {
              currency: "sek",
              product_data: {
                name: storeItem.name,
              },
              unit_amount: storeItem.priceInCents,
            },
            quantity: item.quantity,
          }
        }),
        success_url: `${process.env.SERVER_URL}/success.html`,
        cancel_url: `${process.env.SERVER_URL}/cancel.html`,
      })
      res.json({ url: session.url })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })