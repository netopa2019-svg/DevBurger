import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import toast from 'react-hot-toast'
import SideNavAdmin from '../../../components/SideNavAdmin'
import api from '../../../config/api'

const Layout = styled.div`display:flex;min-height:100vh;`
const Content = styled.div`flex:1;margin-left:240px;padding:2rem;max-width:700px;@media(max-width:768px){margin-left:0;}`
const Title = styled.h1`font-family:'Bebas Neue',cursive;font-size:2.5rem;margin-bottom:2rem;span{color:var(--primary);}`
const Card = styled.div`background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:2rem;margin-bottom:1.5rem;`
const CardTitle = styled.h3`font-size:1rem;font-weight:700;margin-bottom:1.25rem;display:flex;align-items:center;gap:.5rem;`
const Grid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:1rem;@media(max-width:600px){grid-template-columns:1fr;}`
const Field = styled.div`margin-bottom:1rem;`
const Label = styled.label`display:block;font-size:.8rem;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:.4rem;`
const Input = styled.input`width:100%;padding:.85rem 1rem;background:var(--surface2);border:2px solid var(--border);border-radius:var(--radius);color:var(--text);font-size:.95rem;transition:border-color .2s;&:focus{outline:none;border-color:var(--primary);}&::placeholder{color:var(--text3);}`
const Textarea = styled.textarea`width:100%;padding:.85rem 1rem;background:var(--surface2);border:2px solid var(--border);border-radius:var(--radius);color:var(--text);font-size:.95rem;resize:vertical;min-height:100px;&:focus{outline:none;border-color:var(--primary);}&::placeholder{color:var(--text3);}`
const Select = styled.select`width:100%;padding:.85rem 1rem;background:var(--surface2);border:2px solid var(--border);border-radius:var(--radius);color:var(--text);font-size:.95rem;&:focus{outline:none;border-color:var(--primary);}option{background:var(--surface2);}`
const Toggle = styled.label`display:flex;align-items:center;gap:.75rem;cursor:pointer;`
const ToggleInput = styled.input`width:44px;height:24px;appearance:none;background:var(--border);border-radius:99px;position:relative;cursor:pointer;transition:background .2s;&:checked{background:var(--primary);}&::after{content:'';position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:white;transition:left .2s;}&:checked::after{left:22px;}`
const DropZone = styled.div`
  border:2px dashed ${p=>p.dragging?'var(--primary)':'var(--border)'};
  border-radius:var(--radius);padding:2rem;text-align:center;
  cursor:pointer;transition:all .2s;background:${p=>p.dragging?'rgba(230,57,70,.05)':'transparent'};
  &:hover{border-color:var(--primary);}
`
const Preview = styled.img`max-width:100%;max-height:200px;border-radius:var(--radius);margin-top:1rem;object-fit:contain;`
const Btn = styled.button`
  width:100%;padding:1rem;background:var(--primary);color:white;
  border:none;border-radius:var(--radius);font-size:1rem;font-weight:700;
  transition:all .2s;&:hover{background:var(--primary2);transform:translateY(-2px);}
  &:disabled{opacity:.6;cursor:not-allowed;transform:none;}
`
const BtnOut = styled(Btn)`background:transparent;border:2px solid var(--border);color:var(--text2);margin-bottom:.75rem;&:hover{border-color:var(--border);background:var(--surface2);transform:none;}`

export default function NewProduct() {
  const [form, setForm] = useState({ name:'', price:'', description:'', category_id:'', offer:false })
  const [categories, setCategories] = useState([])
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()
  const navigate = useNavigate()
  const set = k => e => setForm({...form,[k]:e.target.value})

  useEffect(() => { api.get('/categories').then(r=>setCategories(r.data)).catch(()=>{}) }, [])

  function handleFile(f) {
    if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name||!form.price||!form.category_id) { toast.error('Preencha os campos obrigatórios'); return }
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k,v])=>fd.append(k,v))
      if (file) fd.append('file', file)
      await api.post('/products', fd, { headers:{'Content-Type':'multipart/form-data'} })
      toast.success('Produto criado! 🍔')
      navigate('/admin/products')
    } catch(e) { toast.error(e.response?.data?.error||'Erro ao criar') } finally { setLoading(false) }
  }

  return (
    <Layout>
      <SideNavAdmin/>
      <Content>
        <Title>Novo <span>Produto</span></Title>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardTitle>📝 Informações</CardTitle>
            <Grid>
              <Field><Label>Nome *</Label><Input placeholder="Ex: DevBurger Clássico" value={form.name} onChange={set('name')} required/></Field>
              <Field><Label>Preço (R$) *</Label><Input type="number" step=".01" placeholder="29.90" value={form.price} onChange={set('price')} required/></Field>
            </Grid>
            <Field><Label>Descrição</Label><Textarea placeholder="Descreva o produto..." value={form.description} onChange={set('description')}/></Field>
            <Grid>
              <Field>
                <Label>Categoria *</Label>
                <Select value={form.category_id} onChange={set('category_id')} required>
                  <option value="">Selecione...</option>
                  {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </Field>
              <Field style={{display:'flex',alignItems:'center',paddingTop:'1.5rem'}}>
                <Toggle>
                  <ToggleInput type="checkbox" checked={form.offer} onChange={e=>setForm({...form,offer:e.target.checked})}/>
                  <span>🔥 Produto em Oferta</span>
                </Toggle>
              </Field>
            </Grid>
          </Card>
          <Card>
            <CardTitle>🖼 Imagem do Produto</CardTitle>
            <DropZone dragging={dragging?1:0} onClick={()=>fileRef.current.click()}
              onDragOver={e=>{e.preventDefault();setDragging(true)}}
              onDragLeave={()=>setDragging(false)}
              onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0])}}>
              <div style={{fontSize:'2.5rem',marginBottom:'.5rem'}}>📷</div>
              <p style={{color:'var(--text2)',fontSize:'.9rem'}}>Clique ou arraste uma imagem aqui</p>
              <p style={{color:'var(--text3)',fontSize:'.78rem',marginTop:'.25rem'}}>JPG, PNG, WEBP até 5MB</p>
              {preview && <Preview src={preview} alt="preview"/>}
              <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>handleFile(e.target.files[0])}/>
            </DropZone>
          </Card>
          <BtnOut type="button" onClick={()=>navigate('/admin/products')}>← Cancelar</BtnOut>
          <Btn type="submit" disabled={loading}>{loading?'Salvando...':'Criar Produto 🍔'}</Btn>
        </form>
      </Content>
    </Layout>
  )
}
