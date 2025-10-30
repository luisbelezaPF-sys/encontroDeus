import { supabase, supabaseAdmin } from './supabase'
import { addDays, isAfter, isBefore } from 'date-fns'

export interface StatusAssinatura {
  status: 'trial' | 'ativo' | 'inativo'
  dataExpiracao: Date
  diasRestantes: number
  podeAcessarPremium: boolean
  mostrarPopup: boolean
  mensagemPopup?: string
}

export async function verificarStatusAssinatura(userId: string): Promise<StatusAssinatura> {
  try {
    const { data: userMeta } = await supabase
      .from('users_meta')
      .select('*')
      .eq('id', userId)
      .single()

    if (!userMeta) {
      // Usuário não encontrado, criar entrada padrão
      const dataInicio = new Date()
      const dataExpiracao = addDays(dataInicio, 7)
      
      await supabase.from('users_meta').insert({
        id: userId,
        email: '',
        nome: 'Usuário',
        status_assinatura: 'trial',
        data_inicio: dataInicio.toISOString(),
        data_expiracao: dataExpiracao.toISOString(),
        progresso_biblico: 0
      })

      return {
        status: 'trial',
        dataExpiracao,
        diasRestantes: 7,
        podeAcessarPremium: true,
        mostrarPopup: false
      }
    }

    const agora = new Date()
    const dataExpiracao = new Date(userMeta.data_expiracao)
    const diasRestantes = Math.max(0, Math.ceil((dataExpiracao.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24)))

    // Verificar se o trial/assinatura expirou
    const expirou = isAfter(agora, dataExpiracao)
    
    let podeAcessarPremium = false
    let mostrarPopup = false
    let mensagemPopup = ''

    switch (userMeta.status_assinatura) {
      case 'ativo':
        podeAcessarPremium = true
        mostrarPopup = false
        break
        
      case 'trial':
        if (expirou) {
          podeAcessarPremium = false
          mostrarPopup = true
          mensagemPopup = 'Seu período gratuito de 7 dias terminou! Assine agora para continuar acessando o conteúdo premium.'
        } else {
          podeAcessarPremium = true
          mostrarPopup = false
        }
        break
        
      case 'inativo':
        podeAcessarPremium = false
        mostrarPopup = true
        mensagemPopup = 'Sua assinatura está inativa. Renove agora para acessar todo o conteúdo premium!'
        break
    }

    return {
      status: userMeta.status_assinatura,
      dataExpiracao,
      diasRestantes,
      podeAcessarPremium,
      mostrarPopup,
      mensagemPopup
    }
  } catch (error) {
    console.error('Erro ao verificar status da assinatura:', error)
    
    // Retornar status padrão em caso de erro
    return {
      status: 'trial',
      dataExpiracao: addDays(new Date(), 7),
      diasRestantes: 7,
      podeAcessarPremium: true,
      mostrarPopup: false
    }
  }
}

export async function criarAssinaturaPendente(userId: string, valor: number = 9.90) {
  try {
    const { data, error } = await supabase.from('assinaturas').insert({
      user_id: userId,
      status: 'pendente',
      valor,
      metodo_pagamento: 'pagbank'
    }).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao criar assinatura pendente:', error)
    return null
  }
}

export async function ativarAssinatura(userId: string) {
  try {
    // Atualizar status do usuário
    await supabase.from('users_meta').update({
      status_assinatura: 'ativo',
      data_expiracao: addDays(new Date(), 30).toISOString() // 30 dias a partir de agora
    }).eq('id', userId)

    // Tentar atualizar assinatura mais recente se existir
    try {
      await supabase.from('assinaturas').update({
        status: 'ativo',
        data_pagamento: new Date().toISOString()
      }).eq('user_id', userId).eq('status', 'pendente')
    } catch (error) {
      // Ignorar erro se não houver assinatura pendente
      console.log('Nenhuma assinatura pendente encontrada para atualizar')
    }

    return true
  } catch (error) {
    console.error('Erro ao ativar assinatura:', error)
    return false
  }
}

export async function desativarAssinatura(userId: string) {
  try {
    await supabase.from('users_meta').update({
      status_assinatura: 'inativo'
    }).eq('id', userId)

    return true
  } catch (error) {
    console.error('Erro ao desativar assinatura:', error)
    return false
  }
}

export async function obterHistoricoPagamentos(userId: string) {
  try {
    const { data, error } = await supabase
      .from('assinaturas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao obter histórico de pagamentos:', error)
    return []
  }
}

// Função para criar usuário admin (executar apenas uma vez)
export async function criarUsuarioAdmin() {
  try {
    // Verificar se admin já existe
    const { data: adminExistente } = await supabase
      .from('users_meta')
      .select('id')
      .eq('role', 'admin')
      .single()

    if (adminExistente) {
      console.log('Admin já existe:', adminExistente.id)
      return adminExistente
    }

    // Criar usuário admin no Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@encontro.com',
      password: 'zelokinho25',
      email_confirm: true
    })

    if (authError) {
      console.error('Erro ao criar usuário admin:', authError)
      return null
    }

    // Inserir metadata do admin
    const { data: metaData, error: metaError } = await supabase.from('users_meta').insert({
      id: authData.user.id,
      email: 'admin@encontro.com',
      nome: 'Administrador',
      role: 'admin',
      status_assinatura: 'ativo',
      data_inicio: new Date().toISOString(),
      data_expiracao: addDays(new Date(), 365).toISOString(), // 1 ano
      progresso_biblico: 100
    }).select().single()

    if (metaError) {
      console.error('Erro ao criar metadata do admin:', metaError)
      return null
    }

    console.log('Admin criado com sucesso:', authData.user.id)
    return metaData
  } catch (error) {
    console.error('Erro geral ao criar admin:', error)
    return null
  }
}