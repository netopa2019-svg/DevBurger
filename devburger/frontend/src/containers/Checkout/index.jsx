// ─── Checkout ─────────────────────────────────────────────────
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { loadStripe } from '@stripe/stripe-js'
import toast from 'react-hot-toast'
import Header from '../../components/Header'
import api from '../../config/api'

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_placeholder')

const Wrap = styled.div`padding-top:70px;`
const Inner = styled.div`max-width:700px;margin:0 auto;padding:2rem;`
const Title = styled.h1`font-family:'Bebas Neue',cursive;font-size:3rem;margin-bottom:2rem;span{color:var(--primary);}`
const Card = styled.div`background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:1.75rem;margin-bottom:1.5rem;`
const CardTitle = styled.h3`font-size:1.1rem;font-weight:700;margin-bottom:1.25rem;display:flex;align-items:center;gap:.5rem;`
const Field = styled.div`margin-bottom:1rem;`
const Label = styled.label`display:block;font-size:.8rem;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:.4rem;`
const Input = styled.input`width:100%;padding:.85rem 1rem;background:var(--surface2);border:2px solid var(--border);border-radius:var(--radius);color:var(--text);font-size:.95rem;&:focus{outline:none;border-color:var(--primary);}&::placeholder{color:var(--text3);}`
const PayOpts = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:.75rem;`
const PayOpt = styled.button`
  padding:1rem;border-radius:var(--radius);border:2px solid ${p=>p.active?'var(--primary)':'var(--border)'};
  background:${p=>p.active?'rgba(230,57,70,.1)':'transparent'};
  color:${p=>p.active?'var(--primary)':'var(--text2)'};
  font-size:.9rem;font-weight:600;transition:all .2s;
  &:hover{border-color:var(--primary);}
`
const Total = styled.div`display:flex;justify-content:space-between;font-size:1.3rem;font-weight:800;margin-top:1rem;`
const Btn = styled.button`
  width:100%;padding:1rem;background:var(--primary);color:white;
  border:none;border-radius:var(--radius);font-size:1rem;font-weight:700;
  transition:all .2s;margin-top:1rem;
  &:hover{background:var(--primary2);transform:translateY(-2px);}
  &:disabled{opacity:.6;cursor:not-allowed;transform:none;}
`

export default function Checkout() {
  const [address, setAddress] = useState('')
  const [payment, setPayment] = useState('stripe')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const cart = JSON.parse(localStorage.getItem('@devburger:cart')||'[]')
  const total = cart.reduce((a,i)=>a+(Number(i.price)*i.quantity),0) + (cart.length?5.99:0)

  async function handleOrder() {
    if (!address) { toast.error('Informe o endereço de entrega'); return }
    if (!cart.length) { toast.error('Carrinho vazio'); return }
    setLoading(true)
    try {
      const { data: order } = await api.post('/orders', { products: cart, total, payment_method: payment, address })
      if (payment === 'stripe') {
        const { data } = await api.post('/create-checkout-session', { products: cart, orderId: order.id })
        const stripe = await stripePromise
        if (data.url) { window.location.href = data.url; return }
        await stripe.redirectToCheckout({ sessionId: data.id })
      } else {
        localStorage.removeItem('@devburger:cart')
        toast.success('Pedido realizado! 🎉')
        navigate(`/complete-payment?order_id=${order.id}`)
      }
    } catch (e) {
      toast.error(e.response?.data?.error || 'Erro ao processar pedido')
    } finally { setLoading(false) }
  }

  return (
    <Wrap>
      <Header cartCount={cart.reduce((a,i)=>a+i.quantity,0)} />
      <Inner>
        <Title>Finalizar <span>Pedido</span></Title>
        <Card>
          <CardTitle>📍 Endereço de Entrega</CardTitle>
          <Field><Label>Endereço completo</Label><Input placeholder="Rua, número, bairro, cidade" value={address} onChange={e=>setAddress(e.target.value)} /></Field>
        </Card>
        <Card>
          <CardTitle>💳 Forma de Pagamento</CardTitle>
          <PayOpts>
            <PayOpt active={payment==='stripe'?1:0} onClick={()=>setPayment('stripe')}>💳 Cartão (Stripe)</PayOpt>
            <PayOpt active={payment==='pix'?1:0} onClick={()=>setPayment('pix')}>⚡ PIX</PayOpt>
          </PayOpts>
        </Card>
        <Card>
          <CardTitle>🧾 Resumo</CardTitle>
          {cart.map(i=>(
            <div key={i.id} style={{display:'flex',justifyContent:'space-between',marginBottom:'.5rem',fontSize:'.9rem',color:'var(--text2)'}}>
              <span>{i.name} x{i.quantity}</span>
              <span>R$ {(Number(i.price)*i.quantity).toFixed(2).replace('.',',')}</span>
            </div>
          ))}
          <Total><span>Total</span><span style={{color:'var(--primary)'}}>R$ {total.toFixed(2).replace('.',',')}</span></Total>
          <Btn onClick={handleOrder} disabled={loading}>{loading?'Processando...':'Confirmar Pedido 🍔'}</Btn>
        </Card>
      </Inner>
    </Wrap>
  )
}
