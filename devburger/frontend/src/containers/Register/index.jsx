import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import toast from 'react-hot-toast'
import api from '../../config/api'

const Page = styled.div`min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);padding:2rem;`
const Box = styled.div`background:var(--surface);padding:3rem;border-radius:20px;width:100%;max-width:480px;border:1px solid var(--border);`
const Title = styled.h2`font-family:'Bebas Neue',cursive;font-size:2.5rem;color:var(--primary);margin-bottom:.5rem;`
const Sub = styled.p`color:var(--text2);font-size:.9rem;margin-bottom:2rem;`
const Grid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:1rem;`
const Field = styled.div`margin-bottom:1.25rem;`
const Label = styled.label`display:block;font-size:.8rem;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:.4rem;`
const Input = styled.input`width:100%;padding:.85rem 1rem;background:var(--surface2);border:2px solid var(--border);border-radius:var(--radius);color:var(--text);font-size:.95rem;transition:border-color .2s;&:focus{outline:none;border-color:var(--primary);}&::placeholder{color:var(--text3);}`
const Btn = styled.button`width:100%;padding:1rem;background:var(--primary);color:white;border:none;border-radius:var(--radius);font-size:1rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;transition:all .2s;margin-top:.5rem;&:hover{background:var(--primary2);transform:translateY(-2px);}&:disabled{opacity:.6;cursor:not-allowed;transform:none;}`
const Footer = styled.p`text-align:center;margin-top:1.5rem;color:var(--text2);font-size:.9rem;a{color:var(--primary);font-weight:600;}`

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const set = k => e => setForm({...form,[k]:e.target.value})

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true)
    try {
      await api.post('/users', form)
      toast.success('Conta criada! Faça login 🎉')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao cadastrar')
    } finally { setLoading(false) }
  }

  return (
    <Page>
      <Box>
        <Title>Criar Conta</Title>
        <Sub>Junte-se ao DevBurger 🍔</Sub>
        <form onSubmit={handleSubmit}>
          <Grid>
            <Field><Label>Nome</Label><Input placeholder="Seu nome" value={form.name} onChange={set('name')} required /></Field>
            <Field><Label>Telefone</Label><Input placeholder="(11) 99999-9999" value={form.phone} onChange={set('phone')} /></Field>
          </Grid>
          <Field><Label>Email</Label><Input type="email" placeholder="seu@email.com" value={form.email} onChange={set('email')} required /></Field>
          <Field><Label>Senha</Label><Input type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={set('password')} required /></Field>
          <Btn type="submit" disabled={loading}>{loading ? 'Criando...' : 'Criar Conta'}</Btn>
        </form>
        <Footer>Já tem conta? <Link to="/login">Entrar</Link></Footer>
      </Box>
    </Page>
  )
}
