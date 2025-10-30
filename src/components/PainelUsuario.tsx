"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { logoutUsuario } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Cross, BookOpen, Heart, Users, Star, LogOut, Calendar, Crown, Share2, Loader2 } from 'lucide-react'
import VersiculoDoDia from '@/components/VersiculoDoDia'
import BotaoCompartilharWhatsApp from '@/components/BotaoCompartilharWhatsApp'

interface PainelUsuarioProps {
  user: any
  userData: any
  statusAssinatura: any
  conteudoDiario: any
}

export default function PainelUsuario({ user, userData, statusAssinatura, conteudoDiario }: PainelUsuarioProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogout = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      console.log('🚪 Iniciando logout...')
      const result = await logoutUsuario()
      
      if (result.success) {
        console.log('✅ Logout realizado com sucesso')
        setMessage(result.message || 'Logout realizado com sucesso!')
        
        // Aguardar um pouco antes de recarregar para mostrar a mensagem
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        console.error('❌ Erro no logout:', result.error)
        setMessage(result.error || 'Erro ao fazer logout')
      }
    } catch (error) {
      console.error('❌ Erro inesperado no logout:', error)
      setMessage('Erro inesperado ao fazer logout')
    } finally {
      setLoading(false)
    }
  }

  const handleAssinarAgora = () => {
    console.log('🔗 Redirecionando para PagBank')
    window.open('https://pag.ae/81aj-zE2K', '_blank')
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando dados do usuário...</p>
        </div>
      </div>
    )
  }

  const isPremium = statusAssinatura?.podeAcessarPremium
  const diasRestantes = statusAssinatura?.diasRestantes || 0
  const nomeUsuario = userData?.nome || user?.user_metadata?.nome || 'Usuário'

  // Calcular progresso baseado em dias de uso (simulado)
  const diasDeUso = userData?.created_at ? 
    Math.floor((new Date().getTime() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0
  const progressoBiblico = Math.min(100, diasDeUso * 5) // 5% por dia, máximo 100%

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
      {/* Header com nome do usuário */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Cross className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Encontro Diário</h1>
                <p className="text-sm text-gray-600">
                  Bem-vindo, {nomeUsuario}! 👋
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {statusAssinatura?.status === 'trial' && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                  <Calendar className="w-3 h-3 mr-1" />
                  {diasRestantes} dias restantes
                </Badge>
              )}
              {isPremium && statusAssinatura?.status === 'ativo' && (
                <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                disabled={loading}
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4 mr-2" />
                )}
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mensagem de feedback */}
      {message && (
        <div className="container mx-auto px-4 pt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-green-700 text-center">{message}</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Boas-vindas personalizadas */}
            <Card className="bg-gradient-to-r from-blue-50 to-amber-50 border-blue-100">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">
                  Olá, {nomeUsuario}! 🙏
                </CardTitle>
                <CardDescription className="text-lg">
                  Que este dia seja abençoado com a presença de Deus em sua vida.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Versículo do Dia */}
            <VersiculoDoDia 
              userId={user.id} 
              conteudo={conteudoDiario}
              isPremium={isPremium}
            />

            {/* Área Premium ou CTA */}
            {isPremium ? (
              <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Crown className="w-6 h-6 text-amber-600" />
                    <CardTitle className="text-xl text-gray-800">Conteúdo Premium</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Card className="bg-white/80">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Heart className="w-5 h-5 text-red-500" />
                          Oração Guiada
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">
                          "Senhor, que este dia seja uma oportunidade de crescer em fé e amor. 
                          Guia meus passos e abençoa cada decisão que eu tomar."
                        </p>
                        <Button size="sm" className="w-full">
                          Fazer Oração
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-blue-500" />
                          Reflexão Profunda
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">
                          Explore o significado mais profundo da Palavra de Deus e como aplicá-la em sua vida diária.
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          Ler Reflexão
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Personagem Bíblico do Dia */}
                  {conteudoDiario?.personagem && (
                    <Card className="bg-white/80">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Users className="w-5 h-5 text-green-500" />
                          Personagem do Dia: {conteudoDiario.personagem.nome}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-2">
                          {conteudoDiario.personagem.descricao}
                        </p>
                        <p className="text-sm text-gray-700 mb-3">
                          {conteudoDiario.personagem.historia}
                        </p>
                        <blockquote className="text-sm italic text-blue-600 border-l-4 border-blue-200 pl-3">
                          {conteudoDiario.personagem.versiculo_relacionado}
                        </blockquote>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">Desbloqueie o Premium</CardTitle>
                  <CardDescription>
                    {statusAssinatura?.status === 'trial' 
                      ? `Você ainda tem ${diasRestantes} dias de teste gratuito!`
                      : 'Acesse conteúdo exclusivo e aprofunde sua fé'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="bg-white/80 rounded-lg p-4 mb-4">
                    <p className="text-2xl font-bold text-gray-800 mb-1">R$ 9,90/mês</p>
                    <p className="text-sm text-gray-600">Cancele quando quiser</p>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                    onClick={handleAssinarAgora}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Assinar Agora
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progresso */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Seu Progresso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progresso Bíblico</span>
                    <span>{progressoBiblico}%</span>
                  </div>
                  <Progress value={progressoBiblico} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-blue-600">{diasRestantes > 0 ? diasRestantes : '∞'}</p>
                    <p className="text-xs text-gray-600">
                      {statusAssinatura?.status === 'trial' ? 'Dias restantes' : 
                       statusAssinatura?.status === 'ativo' ? 'Premium ativo' : 'Dias ativos'}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-green-600">
                      {Math.floor(progressoBiblico / 5)}
                    </p>
                    <p className="text-xs text-gray-600">Versículos lidos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compartilhar */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-green-600" />
                  Compartilhar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Compartilhe sua jornada espiritual com amigos e familiares
                </p>
                <BotaoCompartilharWhatsApp 
                  conteudo={conteudoDiario?.versiculo ? 
                    `${conteudoDiario.versiculo.referencia}: ${conteudoDiario.versiculo.texto}` : 
                    "Venha fazer parte da sua jornada espiritual diária!"
                  }
                  link={typeof window !== 'undefined' ? window.location.origin : ''}
                />
              </CardContent>
            </Card>

            {/* Status da Assinatura */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg">Status da Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Usuário:</span>
                  <span className="text-sm font-medium text-gray-800">
                    {nomeUsuario}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Plano:</span>
                  <Badge variant={isPremium ? "default" : "secondary"}>
                    {statusAssinatura?.status === 'trial' ? 'Teste Grátis' : 
                     statusAssinatura?.status === 'ativo' ? 'Premium' : 'Gratuito'}
                  </Badge>
                </div>
                
                {statusAssinatura?.status === 'trial' && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Expira em:</span>
                    <span className="text-sm font-medium text-amber-600">
                      {diasRestantes} dias
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Membro desde:</span>
                  <span className="text-sm text-gray-800">
                    {userData?.created_at ? 
                      new Date(userData.created_at).toLocaleDateString('pt-BR') : 
                      'Hoje'
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}