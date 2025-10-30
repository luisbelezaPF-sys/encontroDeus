import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ''

// Cliente público para operações client-side
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente admin para operações server-side (apenas quando service key disponível)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Função para verificar se Supabase está configurado
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Função para verificar se admin está configurado
export const isSupabaseAdminConfigured = () => {
  return !!(supabaseUrl && supabaseServiceKey)
}

// Tipos do banco
export interface UserMeta {
  id: string
  email: string
  nome: string
  status_assinatura: 'trial' | 'ativo' | 'inativo'
  data_inicio: string
  data_expiracao: string
  progresso_biblico: number
  created_at: string
}

export interface Conteudo {
  id: string
  tipo: 'reflexao' | 'oracao' | 'liturgia'
  titulo: string
  conteudo: string
  data: string
  premium: boolean
  created_at: string
}

export interface Versiculo {
  id: string
  referencia: string
  texto: string
  data: string
  created_at: string
}

export interface Assinatura {
  id: string
  user_id: string
  status: 'pendente' | 'ativo' | 'cancelado'
  valor: number
  data_pagamento?: string
  metodo_pagamento: string
  created_at: string
}

export interface PersonagemBiblico {
  id: string
  nome: string
  descricao: string
  historia: string
  versiculo_relacionado: string
  data: string
  created_at: string
}