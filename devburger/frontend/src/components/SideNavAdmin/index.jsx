import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { FiPackage, FiShoppingBag, FiTag, FiHome, FiPlusCircle } from 'react-icons/fi'

const Side = styled.aside`
  width: 240px; min-height: 100vh;
  background: var(--surface); border-right: 1px solid var(--border);
  padding: 1.5rem 0; position: fixed; top: 0; left: 0;
`
const Logo = styled(Link)`
  font-family: 'Bebas Neue', cursive;
  font-size: 1.8rem; color: var(--primary);
  padding: 0 1.5rem 1.5rem;
  display: block; border-bottom: 1px solid var(--border);
  span { color: var(--accent); }
`
const Label = styled.div`
  font-size: .7rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1px; color: var(--text3); padding: 1.5rem 1.5rem .5rem;
`
const Item = styled(Link)`
  display: flex; align-items: center; gap: .75rem;
  padding: .75rem 1.5rem; font-size: .9rem; font-weight: 500;
  color: ${p => p.active ? 'var(--primary)' : 'var(--text2)'};
  background: ${p => p.active ? 'rgba(230,57,70,.1)' : 'transparent'};
  border-left: 3px solid ${p => p.active ? 'var(--primary)' : 'transparent'};
  transition: all .2s;
  &:hover { color: var(--primary); background: rgba(230,57,70,.07); }
`

export default function SideNavAdmin() {
  const { pathname } = useLocation()
  return (
    <Side>
      <Logo to="/"><span>Dev</span>Burger <br/><span style={{fontSize:'.75rem',color:'var(--text3)',fontFamily:'Poppins'}}>Admin Panel</span></Logo>
      <Label>Loja</Label>
      <Item to="/"                  active={pathname === '/' ? 1 : 0}><FiHome /> Ver Site</Item>
      <Label>Produtos</Label>
      <Item to="/admin/products"    active={pathname === '/admin/products' ? 1 : 0}><FiPackage /> Produtos</Item>
      <Item to="/admin/products/new" active={pathname === '/admin/products/new' ? 1 : 0}><FiPlusCircle /> Novo Produto</Item>
      <Label>Gestão</Label>
      <Item to="/admin/categories"  active={pathname === '/admin/categories' ? 1 : 0}><FiTag /> Categorias</Item>
      <Item to="/admin/orders"      active={pathname === '/admin/orders' ? 1 : 0}><FiShoppingBag /> Pedidos</Item>
    </Side>
  )
}
