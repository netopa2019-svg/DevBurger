const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

class StripeController {
  async store(req, res) {
    const { products, orderId } = req.body
    try {
      const lineItems = products.map(p => ({
        price_data: {
          currency: 'brl',
          product_data: { name: p.name, images: p.url ? [p.url] : [] },
          unit_amount: Math.round(Number(p.price) * 100),
        },
        quantity: p.quantity || 1,
      }))

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/complete-payment?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
        cancel_url:  `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cart`,
        metadata: { orderId: String(orderId) },
      })

      return res.json({ id: session.id, url: session.url })
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }
}

module.exports = new StripeController()
