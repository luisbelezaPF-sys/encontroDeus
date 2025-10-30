import { supabase, testSupabaseConnection } from './supabase'
import { addDays } from 'date-fns'

export interface Usuario {
  id: string
  email: string
  nome: string
  status_assinatura: 'trial' | 'ativo' | 'inativo'
  data_inicio: string
  data_expiracao: string
  role?: string
}

/**
 * Registrar novo usuário com trial de 7 dias
 */
export async function registrarUsuario(email: string, senha: string, nome: string) {
  try {
    console.log('🔐 Registrando usuário:', { email, nome })
    
    // Testar conexão primeiro
    const connectionOk = await testSupabaseConnection()
    if (!connectionOk) {
      return {
        success: false,
        error: 'Erro de conexão com o servidor. Verifique sua internet e tente novamente.'
      }
    }
    
    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: senha,
      options: {
        data: {
          nome
        },
        emailRedirectTo: undefined // Desabilitar confirmação por email para desenvolvimento
      }
    })

    if (authError) {
      console.error('❌ Erro na autenticação:', authError)
      
      // Tratar erros específicos
      if (authError.message.includes('User already registered')) {
        return {
          success: false,
          error: 'Este email já está cadastrado. Tente fazer login.'
        }
      }
      
      if (authError.message.includes('Password should be at least')) {
        return {
          success: false,
          error: 'A senha deve ter pelo menos 6 caracteres.'
        }
      }
      
      if (authError.message.includes('Invalid email')) {
        return {
          success: false,
          error: 'Email inválido. Verifique o formato.'
        }
      }
      
      if (authError.message.includes('signup is disabled')) {
        return {
          success: false,
          error: 'Cadastro temporariamente desabilitado. Tente novamente mais tarde.'
        }
      }
      
      return {
        success: false,
        error: authError.message || 'Erro ao criar conta'
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Usuário não foi criado. Tente novamente.'
      }
    }

    console.log('✅ Usuário criado no Auth:', authData.user.id)

    // Aguardar um pouco para garantir que o usuário foi criado
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Criar ou atualizar metadata do usuário com trial de 7 dias
    const dataInicio = new Date()
    const dataExpiracao = addDays(dataInicio, 7)

    const { error: metaError } = await supabase.from('users_meta').upsert({
      id: authData.user.id,
      email: email.trim().toLowerCase(),
      nome,
      status_assinatura: 'trial',
      data_inicio: dataInicio.toISOString(),
      data_expiracao: dataExpiracao.toISOString()
    }, {
      onConflict: 'id'
    })

    if (metaError) {
      console.error('❌ Erro ao criar metadata:', metaError)
      
      // Se falhar ao criar metadata, ainda assim considerar sucesso
      // pois o usuário foi criado no Auth
      console.log('⚠️ Usuário criado mas metadata falhou. Continuando...')
    } else {
      console.log('✅ Metadata criada com sucesso')
    }

    return {
      success: true,
      user: authData.user,
      message: 'Conta criada com sucesso! Você tem 7 dias de acesso gratuito ao conteúdo premium.'
    }
  } catch (error: any) {
    console.error('❌ Erro ao registrar usuário:', error)
    return {
      success: false,
      error: error.message || 'Erro inesperado ao criar conta'
    }
  }
}

/**
 * Fazer login do usuário
 */
export async function loginUsuario(email: string, senha: string) {
  try {
    console.log('🔐 Fazendo login:', email)
    
    // Testar conexão primeiro
    const connectionOk = await testSupabaseConnection()
    if (!connectionOk) {
      return {
        success: false,
        error: 'Erro de conexão com o servidor. Verifique sua internet e tente novamente.'
      }
    }
    
    // Limpar sessão anterior se existir
    await supabase.auth.signOut()
    
    // Aguardar um pouco para garantir que a sessão foi limpa
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: senha
    })

    if (error) {
      console.error('❌ Erro no login:', error)
      
      // Tratar erros específicos de login
      if (error.message.includes('Invalid login credentials')) {
        return {
          success: false,
          error: 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.'
        }
      }
      
      if (error.message.includes('Email not confirmed')) {
        return {
          success: false,
          error: 'Confirme seu email antes de fazer login. Verifique sua caixa de entrada.'
        }
      }
      
      if (error.message.includes('Too many requests')) {
        return {
          success: false,
          error: 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.'
        }
      }
      
      if (error.message.includes('signup is disabled')) {
        return {
          success: false,
          error: 'Sistema temporariamente indisponível. Tente novamente mais tarde.'
        }
      }
      
      return {
        success: false,
        error: error.message || 'Erro ao fazer login'
      }
    }

    if (!data.user) {
      return {
        success: false,
        error: 'Usuário não encontrado. Verifique suas credenciais.'
      }
    }

    console.log('✅ Login realizado com sucesso:', data.user.id)

    // Aguardar um pouco para garantir que a sessão foi estabelecida
    await new Promise(resolve => setTimeout(resolve, 500))

    // Buscar dados completos do usuário
    let userData = await obterDadosUsuario(data.user.id)
    
    // Se não encontrar metadata, criar uma básica
    if (!userData) {
      console.log('⚠️ Metadata não encontrada, criando básica...')
      await criarMetadataBasica(data.user)
      userData = await obterDadosUsuario(data.user.id)
    }

    return {
      success: true,
      user: data.user,
      userData: userData,
      message: 'Login realizado com sucesso!'
    }
  } catch (error: any) {
    console.error('❌ Erro ao fazer login:', error)
    return {
      success: false,
      error: error.message || 'Erro inesperado ao fazer login'
    }
  }
}

/**
 * Criar metadata básica para usuário sem dados
 */
async function criarMetadataBasica(user: any) {
  try {
    const dataInicio = new Date()
    const dataExpiracao = addDays(dataInicio, 7)
    
    const { error } = await supabase.from('users_meta').upsert({
      id: user.id,
      email: user.email,
      nome: user.user_metadata?.nome || user.email.split('@')[0],
      status_assinatura: 'trial',
      data_inicio: dataInicio.toISOString(),
      data_expiracao: dataExpiracao.toISOString()
    }, {
      onConflict: 'id'
    })
    
    if (error) {
      console.error('❌ Erro ao criar metadata básica:', error)
    } else {
      console.log('✅ Metadata básica criada')
    }
  } catch (error) {
    console.error('❌ Erro ao criar metadata básica:', error)
  }
}

/**
 * Fazer logout do usuário
 */
export async function logoutUsuario() {
  try {
    console.log('🚪 Fazendo logout...')
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('❌ Erro no logout:', error)
      throw error
    }

    console.log('✅ Logout realizado com sucesso')
    
    // Limpar localStorage se necessário
    if (typeof window !== 'undefined') {
      localStorage.removeItem('supabase.auth.token')
      // Recarregar a página para limpar o estado
      window.location.reload()
    }

    return {
      success: true,
      message: 'Logout realizado com sucesso!'
    }
  } catch (error: any) {
    console.error('❌ Erro ao fazer logout:', error)
    return {
      success: false,
      error: error.message || 'Erro ao fazer logout'
    }
  }
}

/**
 * Verificar sessão atual do usuário
 */
export async function verificarSessao() {
  try {
    console.log('🔍 Verificando sessão...')
    
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Erro ao verificar sessão:', error)
      throw error
    }

    if (!session || !session.user) {
      console.log('❌ Nenhuma sessão ativa')
      return {
        success: false,
        user: null,
        userData: null
      }
    }

    console.log('✅ Sessão ativa encontrada:', session.user.id)

    // Buscar dados completos do usuário
    let userData = await obterDadosUsuario(session.user.id)
    
    // Se não encontrar metadata, criar uma básica
    if (!userData) {
      console.log('⚠️ Metadata não encontrada na sessão, criando básica...')
      await criarMetadataBasica(session.user)
      userData = await obterDadosUsuario(session.user.id)
    }

    return {
      success: true,
      user: session.user,
      userData,
      session
    }
  } catch (error: any) {
    console.error('❌ Erro ao verificar sessão:', error)
    return {
      success: false,
      user: null,
      userData: null,
      error: error.message
    }
  }
}

/**
 * Obter dados completos do usuário da tabela users_meta
 */
export async function obterDadosUsuario(userId: string): Promise<Usuario | null> {
  try {
    console.log('👤 Buscando dados do usuário:', userId)
    
    const { data, error } = await supabase
      .from('users_meta')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('❌ Erro ao buscar dados do usuário:', error)
      return null
    }

    if (!data) {
      console.log('❌ Dados do usuário não encontrados')
      return null
    }

    console.log('✅ Dados do usuário encontrados:', data.nome)
    return data as Usuario
  } catch (error) {
    console.error('❌ Erro ao obter dados do usuário:', error)
    return null
  }
}

/**
 * Atualizar dados do usuário
 */
export async function atualizarDadosUsuario(userId: string, dados: Partial<Usuario>) {
  try {
    console.log('📝 Atualizando dados do usuário:', userId)
    
    const { data, error } = await supabase
      .from('users_meta')
      .update(dados)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao atualizar dados:', error)
      throw error
    }

    console.log('✅ Dados atualizados com sucesso')
    return data
  } catch (error: any) {
    console.error('❌ Erro ao atualizar dados do usuário:', error)
    throw error
  }
}

/**
 * Verificar se usuário está autenticado
 */
export async function usuarioEstaAutenticado(): Promise<boolean> {
  const { success } = await verificarSessao()
  return success
}

/**
 * Obter usuário atual (se autenticado)
 */
export async function obterUsuarioAtual() {
  const resultado = await verificarSessao()
  if (resultado.success) {
    return {
      user: resultado.user,
      userData: resultado.userData
    }
  }
  return null
}

/**
 * Função para debug - testar autenticação
 */
export async function debugAuth() {
  console.log('🔧 === DEBUG AUTENTICAÇÃO ===')
  
  // Testar conexão
  const connectionOk = await testSupabaseConnection()
  console.log('Conexão:', connectionOk ? '✅' : '❌')
  
  // Verificar sessão
  const session = await verificarSessao()
  console.log('Sessão ativa:', session.success ? '✅' : '❌')
  
  if (session.success) {
    console.log('Usuário:', session.userData?.nome || 'Nome não encontrado')
    console.log('Email:', session.user?.email)
    console.log('Status:', session.userData?.status_assinatura)
  }
  
  console.log('🔧 === FIM DEBUG ===')
  return session
}