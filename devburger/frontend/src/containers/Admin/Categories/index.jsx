import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import toast from 'react-hot-toast'
import SideNavAdmin from '../../../components/SideNavAdmin'
import api from '../../../config/api'
import { FiTrash2 } from 'react-icons/fi'

const Layout = styled.div`display:flex;min-height:100vh;`
const Content = styled.div`flex:1;margin-left:240px;padding:2rem;@media(max-width:768px){margin-left:0;}`
const Title = styled.h1`font-family:'Bebas Neue',cursive;font-size:2.5rem;margin-bottom:2rem;span{color:var(--primary);}`
const Grid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:2rem;@media(max-width:768px){grid-template-columns:1fr;}`
const Card = styled.div`background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:1.75rem;`
const CardTitle = styled.h3`font-size:1rem;font-weight:700;margin-bottom:1.25rem;`
const Field = styled.div`margin-bottom:1rem;`
const Label = styled.label`display:block;font-size:.8rem;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:.4rem;`
const Input = styled.input`width:100%;padding:.85rem 1rem;background:var(--surface2);border:2px solid var(--border);border-radius:var(--radius);color:var(--text);font-size:.95rem;&:focus{outline:none;border-color:var(--primary);}&::placeholder{color:var(--text3);}`
const Btn = styled.button`width:100%;padding:.9rem;background:var(--primary);color:white;border:none;border-radius:var(--radius);font-size:.95rem;font-weight:700;transition:all .2s;&:hover{background:var(--primary2);}&:disabled{opacity:.6;cursor:not-allowed;}`
const CatItem = styled.div`display:flex;align-items:center;gap:.75rem;padding:.85rem 1rem;background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);margin-bottom:.5rem;`
const CatImg = styled.div`width:40px;height:40px;border-radius:8px;background:var(--surface);overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;img{width:100%;height:100%;object-fit:cover;}`
const CatName = styled.div`flex:1;font-weight:600;font-size:.95rem;`
const DelBtn = styled.button`background:none;border:none;color:var(--text3);font-size:1rem;transition:color .2s;&:hover{color:var(--danger,#e63946);}`
const Preview = styled.img`max-width:100%;max-height:120px;border-radius:var(--radius);margin-top:.75rem;object-fit:contain;`

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    api.get('/categories').then(r=>setCategories(r.data)).catch(()=>{})
  }, [])

  function handleFile(f) {
    if (!f) return; setFile(f)
    const r = new FileReader(); r.onload=e=>setPreview(e.target.result); r.readAsDataURL(f)
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!name) { toast.error('Informe o nome'); return }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', name)
      if (file) fd.append('file', file)
      const { data } = await api.post('/categories', fd, { headers:{'Content-Type':'multipart/form-data'} })
      setCategories(c=>[...c, data])
      setName(''); setFile(null); setPreview(null)
      toast.success('Categoria criada! ✅')
    } catch(e) { toast.error(e.response?.data?.error||'Erro ao criar') } finally { setLoading(false) }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Deletar "${name}"?`)) return
    try {
      await api.delete(`/categories/${id}`)
      setCategories(c=>c.filter(x=>x.id!==id))
      toast.success('Categoria deletada!')
    } catch { toast.error('Erro ao deletar') }
  }

  return (
    <Layout>
      <SideNavAdmin/>
      <Content>
        <Title>Categorias <span>({categories.length})</span></Title>
        <Grid>
          <Card>
            <CardTitle>➕ Nova Categoria</CardTitle>
            <form onSubmit={handleCreate}>
              <Field><Label>Nome *</Label><Input placeholder="Ex: Burgers, Bebidas..." value={name} onChange={e=>setName(e.target.value)} required/></Field>
              <Field>
                <Label>Ícone/Imagem</Label>
                <button type="button" style={{padding:'.65rem 1.25rem',background:'var(--surface2)',border:'2px solid var(--border)',borderRadius:'var(--radius)',color:'var(--text2)',cursor:'pointer',fontSize:'.875rem',fontWeight:'600',width:'100%'}} onClick={()=>fileRef.current.click()}>
                  📷 Selecionar Imagem
                </button>
                {preview && <Preview src={preview} alt="preview"/>}
                <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>handleFile(e.target.files[0])}/>
              </Field>
              <Btn type="submit" disabled={loading}>{loading?'Criando...':'Criar Categoria'}</Btn>
            </form>
          </Card>
          <Card>
            <CardTitle>📋 Categorias ({categories.length})</CardTitle>
            {!categories.length && <p style={{color:'var(--text2)',textAlign:'center',padding:'2rem 0'}}>Nenhuma categoria</p>}
            {categories.map(c=>(
              <CatItem key={c.id}>
                <CatImg>{c.url?<img src={c.url} alt={c.name}/>:'🏷'}</CatImg>
                <CatName>{c.name}</CatName>
                <DelBtn onClick={()=>handleDelete(c.id,c.name)}><FiTrash2/></DelBtn>
              </CatItem>
            ))}
          </Card>
        </Grid>
      </Content>
    </Layout>
  )
}
