import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import toast from 'react-hot-toast'
import SideNavAdmin from '../../../components/SideNavAdmin'
import api from '../../../config/api'

const Layout = styled.div`display:flex;min-height:100vh;`
const Content = styled.div`flex:1;margin-left:240px;padding:2rem;@media(max-width:768px){margin-left:0;}`
const Title = styled.h1`font-family:'Bebas Neue',cursive;font-size:2.5rem;margin-bottom:2rem;span{color:var(--primary);}`
const Card = styled.div`background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:1.5rem;margin-bottom:1rem;`
const Head = styled.div`display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem;flex-wrap:wrap;gap:.75rem;`
const OrderId = styled.div`font-weight:800;font-size:1.05rem;`
const Meta = styled.div`font-size:.82rem;color:var(--text2);margin-top:.25rem;`
const Badge = styled.span`padding:.3rem .85rem;border-radius:99px;font-size:.78rem;font-weight:700;background:rgba(255,107,107,.15);color:var(--primary);`
const Products = styled.div`border-top:1px solid var(--border);padding-top:.75rem;margin-top:.75rem;`
const ProdRow = styled.div`display:flex;justify-content:space-between;font-size:.875rem;color:var(--text2);margin-bottom:.3rem;`
const Total = styled.div`display:flex;justify-content:space-between;font-weight:800;margin-top:.5rem;`
const Select = styled.select`padding:.5rem .85rem;background:var(--surface2);border:2px solid var(--border);border-radius:var(--radius);color:var(--text);font-size:.85rem;cursor:pointer;&:focus{outline:none;border-color:var(--primary);}option{background:var(--surface2);}`

const STATUS = ['Pedido Realizado','Em Preparação','Saiu para Entrega','Entregue','Cancelado']

export function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/orders').then(r=>{setOrders(r.data);setLoading(false)}).catch(()=>setLoading(false))
  }, [])

  async function updateStatus(id, status) {
    try {
      await api.put(`/orders/${id}/status`, { status })
      setOrders(o=>o.map(x=>x.id===id?{...x,status}:x))
      toast.success('Status atualizado!')
    } catch { toast.error('Erro ao atualizar') }
  }

  return (
    <Layout>
      <SideNavAdmin/>
      <Content>
        <Title>Pedidos <span>({orders.length})</span></Title>
        {loading && <p style={{color:'var(--text2)'}}>Carregando...</p>}
        {!loading && !orders.length && <p style={{color:'var(--text2)',textAlign:'center',padding:'3rem'}}>Nenhum pedido</p>}
        {orders.map(o=>(
          <Card key={o.id}>
            <Head>
              <div>
                <OrderId>Pedido #{o.id}</OrderId>
                <Meta>{o.user?.name||'—'} · {o.user?.email||'—'}</Meta>
                <Meta>📍 {o.address||'—'} · 💳 {o.payment_method||'—'}</Meta>
                <Meta>{o.created_at?new Date(o.created_at).toLocaleString('pt-BR'):''}</Meta>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'.5rem',alignItems:'flex-end'}}>
                <Badge>{o.status}</Badge>
                <Select value={o.status} onChange={e=>updateStatus(o.id,e.target.value)}>
                  {STATUS.map(s=><option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
            </Head>
            <Products>
              {(o.products||[]).map((p,i)=>(
                <ProdRow key={i}><span>{p.name} x{p.quantity}</span><span>R$ {(Number(p.price)*p.quantity).toFixed(2).replace('.',',')}</span></ProdRow>
              ))}
              <Total><span>Total</span><span style={{color:'var(--primary)'}}>R$ {Number(o.total).toFixed(2).replace('.',',')}</span></Total>
            </Products>
          </Card>
        ))}
      </Content>
    </Layout>
  )
}

export default AdminOrders
