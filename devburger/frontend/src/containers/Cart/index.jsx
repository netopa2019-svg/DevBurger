import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../../components/Header'
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi'

const Wrap = styled.div`padding-top:70px;`
const Inner = styled.div`max-width:900px;margin:0 auto;padding:2rem;`
const Title = styled.h1`font-family:'Bebas Neue',cursive;font-size:3rem;color:var(--text);margin-bottom:2rem;span{color:var(--primary);}`
const Layout = styled.div`display:grid;grid-template-columns:1fr 340px;gap:1.5rem;@media(max-width:768px){grid-template-columns:1fr;}`
const Item = styled.div`
  background:var(--surface);border:1px solid var(--border);
  border-radius:16px;padding:1.25rem;display:flex;align-items:center;gap:1rem;
  margin-bottom:.75rem;
`
const ItemImg = styled.div`width:70px;height:70px;border-radius:12px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:2rem;overflow:hidden;flex-shrink:0;img{width:100%;height:100%;object-fit:cover;}`
const ItemInfo = styled.div`flex:1;`
const ItemName = styled.div`font-weight:700;margin-bottom:.25rem;`
const ItemPrice = styled.div`color:var(--primary);font-weight:700;`
const QtyCtrl = styled.div`display:flex;align-items:center;gap:.5rem;margin-top:.5rem;`
const QtyBtn = styled.button`width:28px;height:28px;border-radius:50%;border:2px solid var(--border);background:transparent;color:var(--text);display:flex;align-items:center;justify-content:center;font-size:.9rem;transition:all .2s;&:hover{border-color:var(--primary);color:var(--primary);}`
const QtyVal = styled.span`font-weight:700;min-width:24px;text-align:center;`
const DelBtn = styled.button`background:none;border:none;color:var(--text3);font-size:1.1rem;margin-left:auto;transition:color .2s;&:hover{color:var(--danger,#e63946);}`
const Summary = styled.div`background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:1.5rem;position:sticky;top:90px;`
const SumTitle = styled.h3`font-size:1.1rem;font-weight:800;margin-bottom:1.25rem;`
const SumRow = styled.div`display:flex;justify-content:space-between;margin-bottom:.75rem;color:var(--text2);font-size:.9rem;`
const SumTotal = styled.div`display:flex;justify-content:space-between;font-size:1.2rem;font-weight:800;border-top:2px solid var(--border);padding-top:.75rem;margin-top:.75rem;`
const CheckoutBtn = styled.button`
  width:100%;padding:1rem;background:var(--primary);color:white;
  border:none;border-radius:var(--radius);font-size:1rem;font-weight:700;
  margin-top:1rem;transition:all .2s;
  &:hover{background:var(--primary2);transform:translateY(-2px);}
  &:disabled{opacity:.5;cursor:not-allowed;transform:none;}
`
const Empty = styled.div`text-align:center;padding:5rem 2rem;`

export default function Cart() {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('@devburger:cart')||'[]'))
  const navigate = useNavigate()

  function update(id, delta) {
    const up = cart.map(i=>i.id===id?{...i,quantity:Math.max(1,i.quantity+delta)}:i)
    setCart(up); localStorage.setItem('@devburger:cart',JSON.stringify(up))
  }
  function remove(id) {
    const up = cart.filter(i=>i.id!==id)
    setCart(up); localStorage.setItem('@devburger:cart',JSON.stringify(up))
  }

  const subtotal = cart.reduce((a,i)=>a+(Number(i.price)*i.quantity),0)
  const delivery = cart.length ? 5.99 : 0
  const total = subtotal + delivery

  if (!cart.length) return (
    <Wrap>
      <Header cartCount={0} />
      <Inner>
        <Empty>
          <div style={{fontSize:'5rem',marginBottom:'1rem'}}>🛒</div>
          <h2 style={{marginBottom:'.5rem'}}>Carrinho vazio</h2>
          <p style={{color:'var(--text2)',marginBottom:'1.5rem'}}>Adicione itens do cardápio</p>
          <CheckoutBtn style={{width:'auto',padding:'.75rem 2rem'}} onClick={()=>navigate('/menu')}>Ver Cardápio</CheckoutBtn>
        </Empty>
      </Inner>
    </Wrap>
  )

  return (
    <Wrap>
      <Header cartCount={cart.reduce((a,i)=>a+i.quantity,0)} />
      <Inner>
        <Title>Seu <span>Carrinho</span></Title>
        <Layout>
          <div>
            {cart.map(item=>(
              <Item key={item.id}>
                <ItemImg>{item.url?<img src={item.url} alt={item.name}/>:'🍔'}</ItemImg>
                <ItemInfo>
                  <ItemName>{item.name}</ItemName>
                  <ItemPrice>R$ {(Number(item.price)*item.quantity).toFixed(2).replace('.',',')}</ItemPrice>
                  <QtyCtrl>
                    <QtyBtn onClick={()=>update(item.id,-1)}><FiMinus/></QtyBtn>
                    <QtyVal>{item.quantity}</QtyVal>
                    <QtyBtn onClick={()=>update(item.id,1)}><FiPlus/></QtyBtn>
                  </QtyCtrl>
                </ItemInfo>
                <DelBtn onClick={()=>remove(item.id)}><FiTrash2/></DelBtn>
              </Item>
            ))}
          </div>
          <Summary>
            <SumTitle>Resumo do Pedido</SumTitle>
            <SumRow><span>Subtotal</span><span>R$ {subtotal.toFixed(2).replace('.',',')}</span></SumRow>
            <SumRow><span>Entrega</span><span>R$ {delivery.toFixed(2).replace('.',',')}</span></SumRow>
            <SumTotal><span>Total</span><span style={{color:'var(--primary)'}}>R$ {total.toFixed(2).replace('.',',')}</span></SumTotal>
            <CheckoutBtn onClick={()=>navigate('/checkout')}>Finalizar Pedido →</CheckoutBtn>
          </Summary>
        </Layout>
      </Inner>
    </Wrap>
  )
}
