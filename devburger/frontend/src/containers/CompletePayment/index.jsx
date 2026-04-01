// CompletePayment
import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

const pop = keyframes`0%{transform:scale(0)}70%{transform:scale(1.2)}100%{transform:scale(1)}`
const Wrap = styled.div`min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);`
const Box = styled.div`text-align:center;padding:3rem;background:var(--surface);border-radius:24px;border:1px solid var(--border);max-width:480px;width:90%;`
const Check = styled.div`font-size:5rem;animation:${pop} .5s ease;margin-bottom:1.5rem;`
const Title = styled.h1`font-family:'Bebas Neue',cursive;font-size:3rem;color:var(--success,#06d6a0);margin-bottom:.5rem;`
const Sub = styled.p`color:var(--text2);margin-bottom:2rem;line-height:1.7;`
const Btn = styled.button`padding:.85rem 2.5rem;background:var(--primary);color:white;border:none;border-radius:99px;font-size:1rem;font-weight:700;cursor:pointer;transition:all .2s;margin:.4rem;&:hover{background:var(--primary2);transform:translateY(-2px);}`
const BtnOut = styled(Btn)`background:transparent;border:2px solid var(--border);color:var(--text2);&:hover{border-color:var(--primary);color:var(--primary);}`

export function CompletePayment() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  useEffect(() => { localStorage.removeItem('@devburger:cart') }, [])
  return (
    <Wrap>
      <Box>
        <Check>🎉</Check>
        <Title>Pedido Confirmado!</Title>
        <Sub>Seu pedido #{params.get('order_id')} foi recebido!<br/>Prepare-se para o melhor burger da cidade.</Sub>
        <div>
          <Btn onClick={()=>navigate('/orders')}>Ver Meus Pedidos</Btn>
          <BtnOut onClick={()=>navigate('/')}>Voltar ao Início</BtnOut>
        </div>
      </Box>
    </Wrap>
  )
}

export default CompletePayment
