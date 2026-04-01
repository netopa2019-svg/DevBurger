import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import toast from 'react-hot-toast'
import api from '../../config/api'

const Page = styled.div`
  min-height: 100vh; display: flex;
`
const Left = styled.div`
  flex: 1; background: linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #16213e 100%);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 3rem; position: relative; overflow: hidden;
  @media(max-width:768px) { display: none; }
`
const BurgerEmoji = styled.div`
  font-size: 8rem; animation: float 3s ease-in-out infinite;
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
`
const Tagline = styled.h1`
  font-family: 'Bebas Neue', cursive;
  font-size: 3.5rem; text-align: center; line-height: 1.1; margin-top: 1.5rem;
  color: var(--text);
  span { color: var(--primary); }
`
const Right = styled.div`
  width: 480px; display: flex; align-items: center; justify-content: center;
  background: var(--surface); padding: 3rem;
  @media(max-width:768px) { width: 100%; }
`
const Box = styled.div`width: 100%;`
const Title = styled.h2`
  font-family: 'Bebas Neue', cursive; font-size: 2.5rem;
  color: var(--primary); margin-bottom: .5rem;
`
const Sub = styled.p`color: var(--text2); font-size: .9rem; margin-bottom: 2rem;`
const Field = styled.div`margin-bottom: 1.25rem;`
const Label = styled.label`
  display: block; font-size: .8rem; font-weight: 600;
  color: var(--text2); text-transform: uppercase; letter-spacing: .5px; margin-bottom: .4rem;
`
const Input = styled.input`
  width: 100%; padding: .85rem 1rem;
  background: var(--surface2); border: 2px solid var(--border);
  border-radius: var(--radius); color: var(--text); font-size: .95rem;
  transition: border-color .2s;
  &:focus { outline: none; border-color: var(--primary); }
  &::placeholder { color: var(--text3); }
`
const Btn = styled.button`
  width: 100%; padding: 1rem;
  background: var(--primary); color: white;
  border: none; border-radius: var(--radius);
  font-size: 1rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
  transition: all .2s; margin-top: .5rem;
  &:hover { background: var(--primary2); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(230,57,70,.4); }
  &:disabled { opacity: .6; cursor: not-allowed; transform: none; }
`
const Footer = styled.p`
  text-align: center; margin-top: 1.5rem; color: var(--text2); font-size: .9rem;
  a { color: var(--primary); font-weight: 600; }
`

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/sessions', form)
      localStorage.setItem('@devburger:token', data.token)
      localStorage.setItem('@devburger:user',  JSON.stringify(data.user))
      toast.success(`Bem-vindo, ${data.user.name}! 🍔`)
      navigate(data.user.admin ? '/admin/products' : '/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao entrar')
    } finally { setLoading(false) }
  }

  return (
    <Page>
      <Left>
        <BurgerEmoji>🍔</BurgerEmoji>
        <Tagline>Os melhores<br/><span>burgers</span><br/>da cidade</Tagline>
      </Left>
      <Right>
        <Box>
          <Title>Entrar</Title>
          <Sub>Faça login para continuar</Sub>
          <form onSubmit={handleSubmit}>
            <Field>
              <Label>Email</Label>
              <Input type="email" placeholder="seu@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
            </Field>
            <Field>
              <Label>Senha</Label>
              <Input type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
            </Field>
            <Btn type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</Btn>
          </form>
          <Footer>Não tem conta? <Link to="/register">Cadastre-se</Link></Footer>
        </Box>
      </Right>
    </Page>
  )
}
