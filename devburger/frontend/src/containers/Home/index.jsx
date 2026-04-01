import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import Header from '../../components/Header'
import api from '../../config/api'

const float = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(-15px)}`

const Wrap = styled.div`padding-top:70px;`
const Hero = styled.section`
  min-height: calc(100vh - 70px);
  background: linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 60%, #16213e 100%);
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden; padding: 4rem 2rem;
`
const HeroContent = styled.div`text-align:center;z-index:1;`
const HeroBurger = styled.div`font-size:8rem;animation:${float} 3s ease-in-out infinite;margin-bottom:1rem;`
const HeroTitle = styled.h1`
  font-family:'Bebas Neue',cursive;
  font-size:clamp(3rem,8vw,7rem);color:var(--text);line-height:1;margin-bottom:1rem;
  span{color:var(--primary);}
`
const HeroSub = styled.p`color:var(--text2);font-size:1.1rem;max-width:500px;margin:0 auto 2rem;line-height:1.7;`
const HeroBtns = styled.div`display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;`
const BtnPrimary = styled.button`
  padding:.9rem 2.5rem;background:var(--primary);color:white;
  border:none;border-radius:99px;font-size:1rem;font-weight:700;
  transition:all .2s;&:hover{background:var(--primary2);transform:translateY(-3px);box-shadow:0 12px 30px rgba(230,57,70,.4);}
`
const BtnOutline = styled.button`
  padding:.9rem 2.5rem;background:transparent;color:var(--text);
  border:2px solid var(--border);border-radius:99px;font-size:1rem;font-weight:600;
  transition:all .2s;&:hover{border-color:var(--primary);color:var(--primary);}
`
const Section = styled.section`padding:5rem 2rem;max-width:1200px;margin:0 auto;`
const SectionTitle = styled.h2`
  font-family:'Bebas Neue',cursive;font-size:3rem;color:var(--text);
  margin-bottom:2.5rem;span{color:var(--primary);}
`
const OffersGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem;`
const OfferCard = styled.div`
  background:var(--surface);border:1px solid var(--border);
  border-radius:20px;overflow:hidden;cursor:pointer;
  transition:all .3s;&:hover{transform:translateY(-8px);box-shadow:0 20px 50px rgba(0,0,0,.5);}
`
const OfferImg = styled.div`
  height:200px;background:var(--surface2);
  display:flex;align-items:center;justify-content:center;position:relative;
  img{width:100%;height:100%;object-fit:cover;}
`
const OfferBadge = styled.span`
  position:absolute;top:.75rem;left:.75rem;
  background:var(--primary);color:white;
  padding:.25rem .75rem;border-radius:99px;font-size:.75rem;font-weight:700;
`
const OfferInfo = styled.div`padding:1.25rem;`
const OfferName = styled.h3`font-size:1.05rem;font-weight:700;margin-bottom:.4rem;`
const OfferPrice = styled.div`font-size:1.4rem;font-weight:800;color:var(--primary);`
const AddBtn = styled.button`
  width:100%;padding:.75rem;margin-top:.75rem;
  background:var(--primary);color:white;border:none;
  border-radius:var(--radius);font-weight:700;font-size:.9rem;
  transition:all .2s;&:hover{background:var(--primary2);}
`
const StatsRow = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.5rem;margin:4rem 0;`
const StatCard = styled.div`
  background:var(--surface);border:1px solid var(--border);
  border-radius:20px;padding:2rem;text-align:center;
`
const StatIcon = styled.div`font-size:2.5rem;margin-bottom:.75rem;`
const StatVal = styled.div`font-family:'Bebas Neue',cursive;font-size:2.5rem;color:var(--primary);`
const StatLab = styled.div`color:var(--text2);font-size:.9rem;margin-top:.25rem;`

export default function Home() {
  const [offers, setOffers] = useState([])
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('@devburger:cart') || '[]'))
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/products?offer=true').then(r => setOffers(r.data)).catch(() => {})
  }, [])

  function addToCart(product) {
    const existing = cart.find(i => i.id === product.id)
    const updated = existing
      ? cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...cart, { ...product, quantity: 1 }]
    setCart(updated)
    localStorage.setItem('@devburger:cart', JSON.stringify(updated))
  }

  return (
    <Wrap>
      <Header cartCount={cart.reduce((a,i)=>a+i.quantity,0)} />
      <Hero>
        <HeroContent>
          <HeroBurger>🍔</HeroBurger>
          <HeroTitle>Dev<span>Burger</span></HeroTitle>
          <HeroSub>Os melhores burgers artesanais da cidade. Ingredientes frescos, sabor incrível!</HeroSub>
          <HeroBtns>
            <BtnPrimary onClick={() => navigate('/menu')}>Ver Cardápio 🍔</BtnPrimary>
            <BtnOutline onClick={() => navigate('/orders')}>Meus Pedidos</BtnOutline>
          </HeroBtns>
        </HeroContent>
      </Hero>

      <Section>
        <StatsRow>
          {[['⭐','4.9','Avaliação'],['🍔','50+','Itens'],['🚀','30min','Entrega'],['👨‍🍳','5+','Chefs']].map(([i,v,l])=>(
            <StatCard key={l}><StatIcon>{i}</StatIcon><StatVal>{v}</StatVal><StatLab>{l}</StatLab></StatCard>
          ))}
        </StatsRow>

        {offers.length > 0 && (
          <>
            <SectionTitle>🔥 Ofertas <span>Especiais</span></SectionTitle>
            <OffersGrid>
              {offers.map(p => (
                <OfferCard key={p.id}>
                  <OfferImg>
                    {p.url ? <img src={p.url} alt={p.name} /> : <span style={{fontSize:'4rem'}}>🍔</span>}
                    <OfferBadge>OFERTA</OfferBadge>
                  </OfferImg>
                  <OfferInfo>
                    <OfferName>{p.name}</OfferName>
                    <OfferPrice>R$ {Number(p.price).toFixed(2).replace('.',',')}</OfferPrice>
                    <AddBtn onClick={() => addToCart(p)}>+ Adicionar ao Carrinho</AddBtn>
                  </OfferInfo>
                </OfferCard>
              ))}
            </OffersGrid>
          </>
        )}
      </Section>
    </Wrap>
  )
}
