// ─── Menu ─────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Header from '../../components/Header'
import api from '../../config/api'
import toast from 'react-hot-toast'

const Wrap = styled.div`padding-top:70px;`
const Inner = styled.div`max-width:1200px;margin:0 auto;padding:2rem;`
const PageTitle = styled.h1`font-family:'Bebas Neue',cursive;font-size:3rem;color:var(--text);margin-bottom:2rem;span{color:var(--primary);}`
const CatBar = styled.div`display:flex;gap:.75rem;flex-wrap:wrap;margin-bottom:2rem;`
const CatBtn = styled.button`
  padding:.5rem 1.25rem;border-radius:99px;font-size:.875rem;font-weight:600;
  border:2px solid ${p=>p.active?'var(--primary)':'var(--border)'};
  background:${p=>p.active?'var(--primary)':'transparent'};
  color:${p=>p.active?'white':'var(--text2)'};transition:all .2s;
  &:hover{border-color:var(--primary);color:${p=>p.active?'white':'var(--primary)'};}
`
const Grid = styled.div`display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.25rem;`
const Card = styled.div`
  background:var(--surface);border:1px solid var(--border);
  border-radius:20px;overflow:hidden;transition:all .3s;
  &:hover{transform:translateY(-6px);box-shadow:0 16px 40px rgba(0,0,0,.5);}
`
const CardImg = styled.div`height:180px;background:var(--surface2);display:flex;align-items:center;justify-content:center;img{width:100%;height:100%;object-fit:cover;}`
const CardBody = styled.div`padding:1.25rem;`
const CardName = styled.h3`font-weight:700;margin-bottom:.4rem;`
const CardDesc = styled.p`font-size:.82rem;color:var(--text2);margin-bottom:.75rem;line-height:1.5;`
const CardFoot = styled.div`display:flex;align-items:center;justify-content:space-between;`
const Price = styled.span`font-size:1.3rem;font-weight:800;color:var(--primary);`
const AddBtn = styled.button`
  padding:.5rem 1.25rem;background:var(--primary);color:white;
  border:none;border-radius:99px;font-size:.85rem;font-weight:700;
  transition:all .2s;&:hover{background:var(--primary2);transform:scale(1.05);}
`

export default function Menu() {
  const [products, setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [activeCat, setActiveCat]   = useState('all')
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('@devburger:cart')||'[]'))

  useEffect(() => {
    api.get('/products').then(r=>setProducts(r.data)).catch(()=>{})
    api.get('/categories').then(r=>setCategories(r.data)).catch(()=>{})
  }, [])

  function addToCart(p) {
    const ex = cart.find(i=>i.id===p.id)
    const up = ex ? cart.map(i=>i.id===p.id?{...i,quantity:i.quantity+1}:i) : [...cart,{...p,quantity:1}]
    setCart(up); localStorage.setItem('@devburger:cart',JSON.stringify(up))
    toast.success(`${p.name} adicionado! 🍔`)
  }

  const filtered = activeCat==='all' ? products : products.filter(p=>p.category_id===activeCat)

  return (
    <Wrap>
      <Header cartCount={cart.reduce((a,i)=>a+i.quantity,0)} />
      <Inner>
        <PageTitle>Nosso <span>Cardápio</span></PageTitle>
        <CatBar>
          <CatBtn active={activeCat==='all'?1:0} onClick={()=>setActiveCat('all')}>🍔 Todos</CatBtn>
          {categories.map(c=>(
            <CatBtn key={c.id} active={activeCat===c.id?1:0} onClick={()=>setActiveCat(c.id)}>{c.name}</CatBtn>
          ))}
        </CatBar>
        <Grid>
          {filtered.map(p=>(
            <Card key={p.id}>
              <CardImg>{p.url?<img src={p.url} alt={p.name}/>:<span style={{fontSize:'3rem'}}>🍔</span>}</CardImg>
              <CardBody>
                <CardName>{p.name}</CardName>
                {p.description && <CardDesc>{p.description}</CardDesc>}
                <CardFoot>
                  <Price>R$ {Number(p.price).toFixed(2).replace('.',',')}</Price>
                  <AddBtn onClick={()=>addToCart(p)}>+ Adicionar</AddBtn>
                </CardFoot>
              </CardBody>
            </Card>
          ))}
          {filtered.length===0 && <p style={{gridColumn:'1/-1',textAlign:'center',padding:'3rem',color:'var(--text2)'}}>Nenhum produto encontrado</p>}
        </Grid>
      </Inner>
    </Wrap>
  )
}
