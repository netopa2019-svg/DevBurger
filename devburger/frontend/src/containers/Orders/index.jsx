import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Header from '../../components/Header'
import api from '../../config/api'

const Wrap = styled.div`padding-top:70px;`
const Inner = styled.div`max-width:800px;margin:0 auto;padding:2rem;`
const Title = styled.h1`font-family:'Bebas Neue',cursive;font-size:3rem;margin-bottom:2rem;span{color:var(--primary);}`
const Card = styled.div`background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:1.5rem;margin-bottom:1rem;`
const CardHead = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:.5rem;`
const OrderId = styled.div`font-weight:700;font-size:1rem;`
const OrderDate = styled.div`font-size:.82rem;color:var(--text2);`
const Badge = styled.span`
  padding:.3rem .85rem;border-radius:99px;font-size:.78rem;font-weight:700;
  background:${p=>({
    'Pedido Realizado':'rgba(255,214,10,.15)',
    'Em Preparação':'rgba(255,107,107,.15)',
    'Saiu para Entrega':'rgba(123,97,255,.15)',
    'Entregue':'rgba(6,214,160,.15)',
    'Cancelado':'rgba(255,71,87,.15)',
  }[p.status]||'rgba(255,255,255,.1)')};
  color:${p=>({
    'Pedido Realizado':'var(--warning)',
    'Em Preparação':'var(--primary)',
    'Saiu para Entrega':'#7B61FF',
    'Entregue':'var(--success)',
    'Cancelado':'var(--danger,#e63946)',
  }[p.status]||'var(--text2)')};
`
const Steps = styled.div`display:flex;align-items:center;gap:0;margin:.75rem 0;overflow-x:auto;padding-bottom:.25rem;`
const Step = styled.div`
  display:flex;flex-direction:column;align-items:center;flex:1;min-width:80px;
  position:relative;
  &::before{content:'';position:absolute;top:14px;left:calc(-50% + 14px);right:calc(50% + 14px);height:2px;background:${p=>p.done?'var(--success)':'var(--border)'};z-index:0;}
  &:first-child::before{display:none;}
`
const StepDot = styled.div`
  width:28px;height:28px;border-radius:50%;
  background:${p=>p.done?'var(--success)':'var(--border)'};
  color:${p=>p.done?'#000':'var(--text3)'};
  display:flex;align-items:center;justify-content:center;
  font-size:.75rem;font-weight:800;z-index:1;margin-bottom:.4rem;
  transition:background .3s;
`
const StepLabel = styled.div`font-size:.7rem;color:var(--text2);text-align:center;`
const Products = styled.div`margin-top:.75rem;padding-top:.75rem;border-top:1px solid var(--border);`
const ProdItem = styled.div`display:flex;justify-content:space-between;font-size:.875rem;color:var(--text2);margin-bottom:.3rem;`
const Total = styled.div`display:flex;justify-content:space-between;font-weight:800;margin-top:.5rem;font-size:.95rem;`

const STATUS_STEPS = ['Pedido Realizado','Em Preparação','Saiu para Entrega','Entregue']
const STEP_ICONS = ['📋','👨‍🍳','🚴','✅']

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders').then(r=>{setOrders(r.data);setLoading(false)}).catch(()=>setLoading(false))
  }, [])

  if (loading) return <Wrap><Inner><Title>Meus <span>Pedidos</span></Title><p style={{color:'var(--text2)'}}>Carregando...</p></Inner></Wrap>

  return (
    <Wrap>
      <Header />
      <Inner>
        <Title>Meus <span>Pedidos</span></Title>
        {!orders.length && (
          <div style={{textAlign:'center',padding:'4rem',color:'var(--text2)'}}>
            <div style={{fontSize:'4rem',marginBottom:'1rem'}}>📦</div>
            <h3>Nenhum pedido ainda</h3>
            <p>Faça seu primeiro pedido!</p>
          </div>
        )}
        {orders.map(o=>{
          const stepIdx = STATUS_STEPS.indexOf(o.status)
          return (
            <Card key={o.id}>
              <CardHead>
                <div><OrderId>Pedido #{o.id}</OrderId><OrderDate>{o.created_at ? new Date(o.created_at).toLocaleString('pt-BR') : ''}</OrderDate></div>
                <Badge status={o.status}>{o.status}</Badge>
              </CardHead>
              {o.status !== 'Cancelado' && (
                <Steps>
                  {STATUS_STEPS.map((s,i)=>(
                    <Step key={s} done={i<=stepIdx?1:0}>
                      <StepDot done={i<=stepIdx?1:0}>{STEP_ICONS[i]}</StepDot>
                      <StepLabel>{s.split(' ').slice(0,2).join(' ')}</StepLabel>
                    </Step>
                  ))}
                </Steps>
              )}
              <Products>
                {(o.products||[]).map((p,i)=>(
                  <ProdItem key={i}><span>{p.name} x{p.quantity}</span><span>R$ {(Number(p.price)*p.quantity).toFixed(2).replace('.',',')}</span></ProdItem>
                ))}
                <Total><span>Total</span><span style={{color:'var(--primary)'}}>R$ {Number(o.total).toFixed(2).replace('.',',')}</span></Total>
              </Products>
            </Card>
          )
        })}
      </Inner>
    </Wrap>
  )
}
