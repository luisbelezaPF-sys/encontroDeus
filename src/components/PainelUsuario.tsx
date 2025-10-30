"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Cross, BookOpen, Heart, Users, Star, LogOut, Calendar, Crown, Share2 } from 'lucide-react'
import VersiculoDoDia from '@/components/VersiculoDoDia'
import BotaoCompartilharWhatsApp from '@/components/BotaoCompartilharWhatsApp'
import { atualizarConteudoDiario } from '@/lib/bible-api'

interface PainelUsuarioProps {
  user: any
  statusAssinatura: any
}

export default function PainelUsuario({ user, statusAssinatura }: PainelUsuarioProps) {
  const [userMeta, setUserMeta] = useState<any>(null)
  const [conteudoDiario, setConteudoDiario] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Buscar dados do usuário
        const { data: meta } = await supabase
          .from('users_meta')
          .select('*')
          .eq('id', user.id)
          .single()

        setUserMeta(meta)

        // Carregar conteúdo diário
        const conteudo = await atualizarConteudoDiario(user.id)
        setConteudoDiario(conteudo)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [user.id])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const handleAssinarAgora = () => {
    window.open('https://pag.ae/81aj-zE2K', '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seu painel...</p>
        </div>
      </div>
    )
  }

  const isPremium = statusAssinatura?.podeAcessarPremium
  const diasRestantes = statusAssinatura?.diasRestantes || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Cross className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Encontro Diário</h1>
                <p className="text-sm text-gray-600">Olá, {userMeta?.nome || 'Usuário'}!</p>
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
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Boas-vindas */}
            <Card className="bg-gradient-to-r from-blue-50 to-amber-50 border-blue-100">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">
                  Bem-vindo ao seu encontro diário! 🙏
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

            {/* Área Premium */}
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
                    <span>{userMeta?.progresso_biblico || 0}%</span>
                  </div>
                  <Progress value={userMeta?.progresso_biblico || 0} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-blue-600">7</p>
                    <p className="text-xs text-gray-600">Dias consecutivos</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-green-600">15</p>
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
                  conteudo={conteudoDiario ? 
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
                    {userMeta?.created_at ? 
                      new Date(userMeta.created_at).toLocaleDateString('pt-BR') : 
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