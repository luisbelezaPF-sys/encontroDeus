// Funções utilitárias para o app
import { supabase, supabaseAdmin } from './supabase'

// Buscar versículo do dia da Bible API
export async function buscarVersiculoDoDia(): Promise<{ referencia: string; texto: string } | null> {
  try {
    // Lista de versículos populares para rotacionar
    const versiculos = [
      'john 3:16',
      'psalm 23:1',
      'romans 8:28',
      'philippians 4:13',
      'jeremiah 29:11',
      'matthew 28:20',
      'isaiah 41:10',
      'proverbs 3:5-6',
      'psalm 46:1',
      'romans 8:38-39'
    ]
    
    const hoje = new Date()
    const indice = hoje.getDate() % versiculos.length
    const versiculoEscolhido = versiculos[indice]
    
    const response = await fetch(`https://bible-api.com/${versiculoEscolhido}`)
    const data = await response.json()
    
    if (data && data.text) {
      return {
        referencia: data.reference,
        texto: data.text.trim()
      }
    }
    
    return null
  } catch (error) {
    console.error('Erro ao buscar versículo:', error)
    return null
  }
}

// Salvar versículo no banco
export async function salvarVersiculoDoDia(referencia: string, texto: string) {
  const hoje = new Date().toISOString().split('T')[0]
  
  const { error } = await supabaseAdmin
    .from('versiculos')
    .upsert({
      referencia,
      texto,
      data: hoje
    }, {
      onConflict: 'data'
    })
    
  if (error) {
    console.error('Erro ao salvar versículo:', error)
  }
}

// Verificar status da assinatura do usuário
export async function verificarAssinatura(userId: string) {
  const { data, error } = await supabase
    .from('users_meta')
    .select('status_assinatura, data_expiracao')
    .eq('id', userId)
    .single()
    
  if (error || !data) return { status: 'inativo', expirado: true }
  
  const hoje = new Date()
  const expiracao = new Date(data.data_expiracao)
  const expirado = hoje > expiracao
  
  return {
    status: data.status_assinatura,
    expirado
  }
}

// Atualizar progresso bíblico
export async function atualizarProgresso(userId: string, incremento: number = 1) {
  const { data: user } = await supabase
    .from('users_meta')
    .select('progresso_biblico')
    .eq('id', userId)
    .single()
    
  if (user) {
    const novoProgresso = Math.min(100, user.progresso_biblico + incremento)
    
    await supabase
      .from('users_meta')
      .update({ progresso_biblico: novoProgresso })
      .eq('id', userId)
  }
}

// Criar usuário admin padrão
export async function criarAdminPadrao() {
  const { error } = await supabaseAdmin
    .from('users_meta')
    .upsert({
      id: 'admin',
      email: 'admin@encontrodiario.com',
      nome: 'Administrador',
      status_assinatura: 'ativo',
      data_inicio: new Date().toISOString(),
      data_expiracao: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      progresso_biblico: 100
    }, {
      onConflict: 'id'
    })
    
  if (error) {
    console.error('Erro ao criar admin:', error)
  }
}

// Personagens bíblicos do dia
export const personagensBiblicos = [
  {
    nome: "Abraão",
    descricao: "O pai da fé",
    historia: "Abraão foi chamado por Deus para deixar sua terra e seguir para uma terra prometida. Sua fé inabalável o tornou pai de muitas nações.",
    versiculo_relacionado: "Pela fé Abraão, sendo chamado, obedeceu, indo para um lugar que havia de receber por herança. - Hebreus 11:8"
  },
  {
    nome: "Moisés",
    descricao: "O libertador do povo de Israel",
    historia: "Moisés foi escolhido por Deus para libertar o povo de Israel da escravidão no Egito e receber os Dez Mandamentos.",
    versiculo_relacionado: "Pela fé Moisés, sendo já grande, recusou ser chamado filho da filha de Faraó. - Hebreus 11:24"
  },
  {
    nome: "Davi",
    descricao: "O rei segundo o coração de Deus",
    historia: "Davi foi pastor, guerreiro, músico e rei. Apesar de seus erros, sempre buscou o perdão e a presença de Deus.",
    versiculo_relacionado: "Achei a Davi, filho de Jessé, homem segundo o meu coração. - Atos 13:22"
  },
  {
    nome: "Maria",
    descricao: "A mãe de Jesus",
    historia: "Maria aceitou com humildade e fé o chamado de Deus para ser a mãe do Salvador, tornando-se exemplo de obediência.",
    versiculo_relacionado: "Disse então Maria: Eis aqui a serva do Senhor; cumpra-se em mim segundo a tua palavra. - Lucas 1:38"
  },
  {
    nome: "Pedro",
    descricao: "O apóstolo corajoso",
    historia: "Pedro foi um dos discípulos mais próximos de Jesus. Apesar de negar Jesus, foi perdoado e se tornou líder da igreja primitiva.",
    versiculo_relacionado: "E eu te digo que tu és Pedro, e sobre esta pedra edificarei a minha igreja. - Mateus 16:18"
  },
  {
    nome: "Paulo",
    descricao: "O apóstolo dos gentios",
    historia: "Paulo era perseguidor dos cristãos até ter um encontro com Jesus. Tornou-se o maior missionário do cristianismo.",
    versiculo_relacionado: "Mas pela graça de Deus sou o que sou; e a sua graça para comigo não foi vã. - 1 Coríntios 15:10"
  },
  {
    nome: "Ester",
    descricao: "A rainha corajosa",
    historia: "Ester arriscou sua vida para salvar o povo judeu da destruição, mostrando coragem e fé em momentos difíceis.",
    versiculo_relacionado: "E quem sabe se para tal tempo como este chegaste a este reino? - Ester 4:14"
  }
]

export function obterPersonagemDoDia() {
  const hoje = new Date()
  const indice = hoje.getDate() % personagensBiblicos.length
  return personagensBiblicos[indice]
}