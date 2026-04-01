import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import toast from 'react-hot-toast'
import SideNavAdmin from '../../../components/SideNavAdmin'
import api from '../../../config/api'
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'

const Layout = styled.div`display:flex;min-height:100vh;`
const Content = styled.div`flex:1;margin-left:240px;padding:2rem;@media(max-width:768px){margin-left:0;}`
const Header = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;flex-wrap:wrap;gap:1rem;`
const Title = styled.h1`font-family:'Bebas Neue',cursive;font-size:2.5rem;span{color:var(--primary);}`
const AddBtn = styled.button`
  display:flex;align-items:center;gap:.5rem;
  padding:.75rem 1.5rem;background:var(--primary);color:white;
  border:none;border-radius:var(--radius);font-weight:700;font-size:.9rem;
  transition:all .2s;&:hover{background:var(--primary2);transform:translateY(-2px);}
`
const Table = styled.div`background:var(--surface);border:1px solid var(--border);border-radius:20px;overflow:hidden;`
const THead = styled.div`display:grid;grid-template-columns:60px 1fr 120px 100px 80px 120px;padding:.75rem 1.25rem;background:var(--surface2);font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--text2);@media(max-width:768px){display:none;}`
const TRow = styled.div`display:grid;grid-template-columns:60px 1fr 120px 100px 80px 120px;padding:1rem 1.25rem;border-top:1px solid var(--border);align-items:center;transition:background .2s;&:hover{background:rgba(255,255,255,.02);}@media(max-width:768px){grid-template-columns:1fr;gap:.5rem;}`
const Img = styled.div`width:48px;height:48px;border-radius:10px;background:var(--surface2);overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:1.5rem;img{width:100%;height:100%;object-fit:cover;}`
const Name = styled.div`font-weight:600;font-size:.95rem;`
const Cat = styled.div`font-size:.82rem;color:var(--text2);margin-top:.2rem;`
const Price = styled.div`font-weight:700;color:var(--primary);`
const OfferBadge = styled.span`padding:.2rem .65rem;border-radius:99px;font-size:.72rem;font-weight:700;background:${p=>p.on?'rgba(255,214,10,.15)':'rgba(255,255,255,.05)'};color:${p=>p.on?'var(--warning)':'var(--text3)'};`
const Actions = styled.div`display:flex;gap:.5rem;`
const ActBtn = styled.button`width:34px;height:34px;border-radius:8px;border:1px solid var(--border);background:transparent;color:var(--text2);display:flex;align-items:center;justify-content:center;transition:all .2s;&:hover{border-color:${p=>p.danger?'var(--danger,#e63946)':'var(--primary)'};color:${p=>p.danger?'var(--danger,#e63946)':'var(--primary)'};}` 
const Empty = styled.div`text-align:center;padding:4rem;color:var(--text2);`

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/products').then(r=>{setProducts(r.data);setLoading(false)}).catch(()=>setLoading(false))
  }, [])

  async function handleDelete(id, name) {
    if (!window.confirm(`Deletar "${name}"?`)) return
    try {
      await api.delete(`/products/${id}`)
      setProducts(p=>p.filter(x=>x.id!==id))
      toast.success('Produto deletado!')
    } catch { toast.error('Erro ao deletar') }
  }

  return (
    <Layout>
      <SideNavAdmin />
      <Content>
        <Header>
          <Title>Produtos <span>({products.length})</span></Title>
          <AddBtn onClick={()=>navigate('/admin/products/new')}><FiPlus/> Novo Produto</AddBtn>
        </Header>
        <Table>
          <THead>
            <span>Img</span><span>Nome</span><span>Categoria</span>
            <span>Preço</span><span>Oferta</span><span>Ações</span>
          </THead>
          {loading && <Empty>Carregando...</Empty>}
          {!loading && !products.length && <Empty>Nenhum produto cadastrado</Empty>}
          {products.map(p=>(
            <TRow key={p.id}>
              <Img>{p.url?<img src={p.url} alt={p.name}/>:'🍔'}</Img>
              <div><Name>{p.name}</Name><Cat>{p.category?.name||'—'}</Cat></div>
              <Price>R$ {Number(p.price).toFixed(2).replace('.',',')}</Price>
              <div></div>
              <OfferBadge on={p.offer?1:0}>{p.offer?'Sim':'Não'}</OfferBadge>
              <Actions>
                <ActBtn onClick={()=>navigate(`/admin/products/edit/${p.id}`)} title="Editar"><FiEdit/></ActBtn>
                <ActBtn danger onClick={()=>handleDelete(p.id,p.name)} title="Deletar"><FiTrash2/></ActBtn>
              </Actions>
            </TRow>
          ))}
        </Table>
      </Content>
    </Layout>
  )
}
