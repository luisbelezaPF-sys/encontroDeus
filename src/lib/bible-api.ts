import axios from 'axios'
import { supabase, supabaseAdmin } from './supabase'

// Lista de personagens bíblicos para rotação diária
const personagensBiblicos = [
  {
    nome: 'Abraão',
    descricao: 'Pai da fé, obediente a Deus em todas as circunstâncias.',
    historia: 'Abraão deixou sua terra natal por fé, confiando na promessa de Deus. Sua obediência foi testada quando Deus pediu que sacrificasse seu filho Isaque, mas sua fé permaneceu inabalável.',
    versiculo_relacionado: 'Hebreus 11:8 - Pela fé Abraão, sendo chamado, obedeceu, indo para um lugar que havia de receber por herança; e saiu, sem saber para onde ia.'
  },
  {
    nome: 'Moisés',
    descricao: 'Líder que conduziu Israel à liberdade do Egito.',
    historia: 'Moisés foi escolhido por Deus para libertar o povo de Israel da escravidão no Egito. Através dele, Deus realizou grandes milagres e entregou os Dez Mandamentos.',
    versiculo_relacionado: 'Êxodo 14:13 - Moisés, porém, disse ao povo: Não temais; estai quietos e vede o livramento do SENHOR.'
  },
  {
    nome: 'Davi',
    descricao: 'Rei segundo o coração de Deus, salmista e guerreiro.',
    historia: 'Davi foi ungido rei ainda jovem, venceu o gigante Golias e se tornou o maior rei de Israel. Apesar de seus erros, sempre buscou o perdão e a presença de Deus.',
    versiculo_relacionado: '1 Samuel 16:7 - O SENHOR não vê como vê o homem, pois o homem vê o que está diante dos olhos, porém o SENHOR olha para o coração.'
  },
  {
    nome: 'Maria',
    descricao: 'Mãe de Jesus, exemplo de humildade e fé.',
    historia: 'Maria aceitou com humildade o chamado de Deus para ser a mãe do Salvador. Sua fé e obediência são exemplos para todos os cristãos.',
    versiculo_relacionado: 'Lucas 1:38 - Disse então Maria: Eis aqui a serva do Senhor; cumpra-se em mim segundo a tua palavra.'
  },
  {
    nome: 'Paulo',
    descricao: 'Apóstolo que espalhou o Evangelho pelo mundo.',
    historia: 'Paulo, antes perseguidor dos cristãos, teve um encontro transformador com Jesus e se tornou o maior missionário da história, escrevendo grande parte do Novo Testamento.',
    versiculo_relacionado: 'Filipenses 4:13 - Posso todas as coisas em Cristo que me fortalece.'
  },
  {
    nome: 'José',
    descricao: 'Exemplo de perdão e fidelidade a Deus.',
    historia: 'José foi vendido como escravo pelos próprios irmãos, mas manteve sua fé em Deus. Tornou-se governador do Egito e salvou sua família da fome, perdoando aqueles que o traíram.',
    versiculo_relacionado: 'Gênesis 50:20 - Vós bem intentastes mal contra mim, porém Deus o intentou para bem.'
  },
  {
    nome: 'Ester',
    descricao: 'Rainha corajosa que salvou seu povo.',
    historia: 'Ester arriscou sua vida para salvar o povo judeu da destruição. Sua coragem e fé em Deus mudaram o destino de uma nação inteira.',
    versiculo_relacionado: 'Ester 4:14 - Quem sabe se para tal tempo como este chegaste a este reino?'
  }
]

// Versículos inspiradores para diferentes situações
const versiculosInspiradores = [
  { referencia: 'João 3:16', texto: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.' },
  { referencia: 'Filipenses 4:13', texto: 'Posso todas as coisas em Cristo que me fortalece.' },
  { referencia: 'Jeremias 29:11', texto: 'Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o SENHOR; pensamentos de paz e não de mal, para vos dar o fim que esperais.' },
  { referencia: 'Salmos 23:1', texto: 'O SENHOR é o meu pastor; nada me faltará.' },
  { referencia: 'Romanos 8:28', texto: 'E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus.' },
  { referencia: 'Isaías 40:31', texto: 'Mas os que esperam no SENHOR renovarão as suas forças; subirão com asas como águias; correrão, e não se cansarão; caminharão, e não se fatigarão.' },
  { referencia: 'Mateus 11:28', texto: 'Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.' }
]

export async function buscarVersiculoDoDia(): Promise<{ referencia: string; texto: string }> {
  try {
    // Tentar buscar da Bible API
    const response = await axios.get('https://bible-api.com/john 3:16', { timeout: 5000 })
    
    if (response.data && response.data.text) {
      return {
        referencia: response.data.reference || 'João 3:16',
        texto: response.data.text.trim()
      }
    }
  } catch (error) {
    console.log('Erro ao buscar da Bible API, usando versículo local:', error)
  }

  // Fallback: usar versículo local baseado no dia
  const hoje = new Date()
  const indice = hoje.getDate() % versiculosInspiradores.length
  return versiculosInspiradores[indice]
}

export function obterPersonagemDoDia() {
  const hoje = new Date()
  const indice = hoje.getDate() % personagensBiblicos.length
  return personagensBiblicos[indice]
}

export async function atualizarConteudoDiario(userId?: string) {
  try {
    // Buscar versículo do dia
    const versiculo = await buscarVersiculoDoDia()
    
    // Obter personagem do dia
    const personagem = obterPersonagemDoDia()
    
    // Salvar versículo no Supabase (usando upsert para evitar duplicatas)
    const hoje = new Date().toISOString().split('T')[0]
    
    await supabase.from('versiculos').upsert({
      referencia: versiculo.referencia,
      texto: versiculo.texto,
      data: hoje
    }, {
      onConflict: 'referencia,data'
    })

    // Salvar personagem do dia
    await supabase.from('personagens_biblicos').upsert({
      nome: personagem.nome,
      descricao: personagem.descricao,
      historia: personagem.historia,
      versiculo_relacionado: personagem.versiculo_relacionado,
      data: hoje
    }, {
      onConflict: 'nome,data'
    })

    // Atualizar progresso do usuário se fornecido
    if (userId) {
      await atualizarProgressoUsuario(userId, 'versiculo_lido')
    }

    return { versiculo, personagem }
  } catch (error) {
    console.error('Erro ao atualizar conteúdo diário:', error)
    
    // Retornar dados locais em caso de erro
    const hoje = new Date()
    const versiculoLocal = versiculosInspiradores[hoje.getDate() % versiculosInspiradores.length]
    const personagemLocal = personagensBiblicos[hoje.getDate() % personagensBiblicos.length]
    
    return { 
      versiculo: versiculoLocal, 
      personagem: personagemLocal 
    }
  }
}

export async function atualizarProgressoUsuario(userId: string, acao: 'versiculo_lido' | 'oracao_feita' | 'reflexao_lida') {
  try {
    const hoje = new Date().toISOString().split('T')[0]
    
    // Buscar progresso atual
    const { data: progressoAtual } = await supabase
      .from('progresso')
      .select('*')
      .eq('user_id', userId)
      .single()

    let novoProgresso = {
      user_id: userId,
      versiculos_lidos: 0,
      oracoes_feitas: 0,
      reflexoes_lidas: 0,
      dias_consecutivos: 1,
      ultima_atividade: hoje
    }

    if (progressoAtual) {
      // Calcular dias consecutivos
      const ultimaAtividade = new Date(progressoAtual.ultima_atividade)
      const hojeDt = new Date(hoje)
      const diffTime = hojeDt.getTime() - ultimaAtividade.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      let diasConsecutivos = progressoAtual.dias_consecutivos
      if (diffDays === 1) {
        diasConsecutivos += 1
      } else if (diffDays > 1) {
        diasConsecutivos = 1
      }

      novoProgresso = {
        ...progressoAtual,
        dias_consecutivos: diasConsecutivos,
        ultima_atividade: hoje
      }

      // Incrementar contador específico
      switch (acao) {
        case 'versiculo_lido':
          novoProgresso.versiculos_lidos += 1
          break
        case 'oracao_feita':
          novoProgresso.oracoes_feitas += 1
          break
        case 'reflexao_lida':
          novoProgresso.reflexoes_lidas += 1
          break
      }
    } else {
      // Primeiro acesso
      switch (acao) {
        case 'versiculo_lido':
          novoProgresso.versiculos_lidos = 1
          break
        case 'oracao_feita':
          novoProgresso.oracoes_feitas = 1
          break
        case 'reflexao_lida':
          novoProgresso.reflexoes_lidas = 1
          break
      }
    }

    // Salvar progresso
    await supabase.from('progresso').upsert(novoProgresso, {
      onConflict: 'user_id'
    })

    // Atualizar progresso bíblico na tabela users_meta
    const progressoBiblico = Math.min(100, 
      (novoProgresso.versiculos_lidos * 2) + 
      (novoProgresso.oracoes_feitas * 3) + 
      (novoProgresso.reflexoes_lidas * 5) +
      (novoProgresso.dias_consecutivos * 1)
    )

    await supabase.from('users_meta').update({
      progresso_biblico: progressoBiblico
    }).eq('id', userId)

    return novoProgresso
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error)
    return null
  }
}

export async function obterConteudoDiario() {
  try {
    const hoje = new Date().toISOString().split('T')[0]
    
    // Buscar versículo do dia
    const { data: versiculo } = await supabase
      .from('versiculos')
      .select('*')
      .eq('data', hoje)
      .single()

    // Buscar personagem do dia
    const { data: personagem } = await supabase
      .from('personagens_biblicos')
      .select('*')
      .eq('data', hoje)
      .single()

    // Se não existir conteúdo para hoje, criar
    if (!versiculo || !personagem) {
      return await atualizarConteudoDiario()
    }

    return { versiculo, personagem }
  } catch (error) {
    console.error('Erro ao obter conteúdo diário:', error)
    return await atualizarConteudoDiario()
  }
}