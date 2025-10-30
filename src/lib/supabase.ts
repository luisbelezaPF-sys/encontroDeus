import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ''

// Verificar se as variáveis estão configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis do Supabase não configuradas:', {
    url: !!supabaseUrl,
    anonKey: !!supabaseAnonKey
  })
}

// Cliente público para operações client-side
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

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
  const configured = !!(supabaseUrl && supabaseAnonKey)
  console.log('🔧 Supabase configurado:', configured)
  return configured
}

// Função para verificar se admin está configurado
export const isSupabaseAdminConfigured = () => {
  return !!(supabaseUrl && supabaseServiceKey)
}

// Função para testar conexão
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testando conexão com Supabase...')
    const { data, error } = await supabase.from('users_meta').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Erro na conexão:', error)
      return false
    }
    
    console.log('✅ Conexão com Supabase funcionando')
    return true
  } catch (error) {
    console.error('❌ Erro ao testar conexão:', error)
    return false
  }
}

// Tipos do banco
export interface UserMeta {
  id: string
  email: string
  nome: string
  status_assinatura: 'trial' | 'ativo' | 'inativo'
  data_inicio: string
  data_expiracao: string
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