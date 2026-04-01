import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiPackage } from 'react-icons/fi'
import { MdAdminPanelSettings } from 'react-icons/md'

const Nav = styled.nav`
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  background: rgba(13,13,26,.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  padding: 0 2rem;
  height: 70px;
  display: flex; align-items: center; justify-content: space-between;
`
const Logo = styled(Link)`
  font-family: 'Bebas Neue', cursive;
  font-size: 2rem; color: var(--primary);
  letter-spacing: 2px;
  span { color: var(--accent); }
`
const NavLinks = styled.div`
  display: flex; align-items: center; gap: 1.5rem;
  @media(max-width:768px) {
    display: ${p => p.open ? 'flex' : 'none'};
    flex-direction: column; position: fixed;
    top: 70px; left: 0; right: 0;
    background: var(--surface); padding: 2rem;
    border-bottom: 1px solid var(--border);
  }
`
const NavLink = styled(Link)`
  color: var(--text2); font-size: .9rem; font-weight: 500;
  display: flex; align-items: center; gap: .4rem;
  transition: color .2s;
  &:hover { color: var(--primary); }
`
const CartBtn = styled(Link)`
  position: relative;
  background: var(--primary); color: white;
  padding: .5rem 1.25rem; border-radius: 99px;
  font-size: .85rem; font-weight: 600;
  display: flex; align-items: center; gap: .4rem;
  transition: all .2s;
  &:hover { background: var(--primary2); transform: translateY(-1px); }
`
const Badge = styled.span`
  position: absolute; top: -6px; right: -6px;
  background: var(--accent); color: #000;
  width: 18px; height: 18px; border-radius: 50%;
  font-size: .7rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
`
const Hamburger = styled.button`
  display: none; background: none; border: none; color: var(--text); font-size: 1.4rem;
  @media(max-width:768px) { display: flex; }
`

export default function Header({ cartCount = 0 }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('@devburger:user') || '{}')

  function handleLogout() {
    localStorage.removeItem('@devburger:token')
    localStorage.removeItem('@devburger:user')
    navigate('/login')
  }

  return (
    <Nav>
      <Logo to="/"><span>Dev</span>Burger</Logo>
      <Hamburger onClick={() => setOpen(!open)}>{open ? <FiX /> : <FiMenu />}</Hamburger>
      <NavLinks open={open}>
        <NavLink to="/">🏠 Início</NavLink>
        <NavLink to="/menu">🍔 Cardápio</NavLink>
        <NavLink to="/orders"><FiPackage /> Pedidos</NavLink>
        {user.admin && <NavLink to="/admin/products"><MdAdminPanelSettings /> Admin</NavLink>}
        <NavLink to="/login" onClick={handleLogout}><FiLogOut /> Sair</NavLink>
        <CartBtn to="/cart">
          <FiShoppingCart /> Carrinho
          {cartCount > 0 && <Badge>{cartCount}</Badge>}
        </CartBtn>
      </NavLinks>
    </Nav>
  )
}
