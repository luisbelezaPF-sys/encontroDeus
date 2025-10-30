"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Heart, User, Share2, Star, Lock } from 'lucide-react'
import { atualizarProgressoUsuario } from '@/lib/bible-api'
import BotaoCompartilharWhatsApp from '@/components/BotaoCompartilharWhatsApp'

interface VersiculoDoDiaProps {
  userId: string
  conteudo: any
  isPremium: boolean
}

export default function VersiculoDoDia({ userId, conteudo, isPremium }: VersiculoDoDiaProps) {
  const [jaLeu, setJaLeu] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleMarcarComoLido = async () => {
    if (jaLeu) return
    
    setLoading(true)
    try {
      await atualizarProgressoUsuario(userId, 'versiculo_lido')
      setJaLeu(true)
    } catch (error) {
      console.error('Erro ao marcar como lido:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssinarPremium = () => {
    window.open('https://pag.ae/81aj-zE2K', '_blank')
  }

  if (!conteudo) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
        <CardContent className="p-8 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando conteúdo diário...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Versículo do Dia - SEMPRE VISÍVEL */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Versículo do Dia
          </CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-lg p-6">
            <blockquote className="text-lg text-gray-800 font-medium italic mb-3">
              "{conteudo.versiculo.texto}"
            </blockquote>
            <cite className="text-blue-600 font-semibold">
              — {conteudo.versiculo.referencia}
            </cite>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleMarcarComoLido}
              disabled={jaLeu || loading}
              className={jaLeu ? "bg-green-600 hover:bg-green-600" : ""}
            >
              <Heart className="w-4 h-4 mr-2" />
              {jaLeu ? 'Lido ✓' : loading ? 'Marcando...' : 'Marcar como Lido'}
            </Button>
            
            <BotaoCompartilharWhatsApp 
              conteudo={`${conteudo.versiculo.referencia}: ${conteudo.versiculo.texto}`}
              link={typeof window !== 'undefined' ? window.location.origin : ''}
            />
          </div>
        </CardContent>
      </Card>

      {/* Personagem Bíblico do Dia - CONTROLE DE ACESSO */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <User className="w-6 h-6 text-green-600" />
            Personagem Bíblico do Dia
            {!isPremium && <Lock className="w-4 h-4 text-amber-500 ml-2" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPremium ? (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {conteudo.personagem.nome}
              </h3>
              <p className="text-gray-600 mb-4">
                {conteudo.personagem.descricao}
              </p>
              
              {conteudo.personagem.historia && (
                <div className="bg-white/80 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    História Completa
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">
                    {conteudo.personagem.historia}
                  </p>
                  {conteudo.personagem.versiculo_relacionado && (
                    <div className="bg-amber-50 rounded p-3">
                      <p className="text-sm text-amber-800 italic">
                        {conteudo.personagem.versiculo_relacionado}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 text-center">
              <Lock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Conteúdo Premium Bloqueado
              </h3>
              <p className="text-gray-600 mb-4">
                Desbloqueie histórias completas dos personagens bíblicos, reflexões profundas e muito mais!
              </p>
              <Button 
                onClick={handleAssinarPremium}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
              >
                <Star className="w-4 h-4 mr-2" />
                Assinar Premium - R$ 9,90/mês
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reflexão do Dia - CONTROLE DE ACESSO */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            Reflexão do Dia
            {!isPremium && <Lock className="w-4 h-4 text-amber-500 ml-2" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPremium ? (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                A Força da Fé em Tempos Difíceis
              </h3>
              <p className="text-gray-700 mb-4">
                Assim como {conteudo.personagem.nome}, somos chamados a confiar em Deus mesmo quando 
                as circunstâncias parecem impossíveis. A fé não é a ausência de dúvidas, mas a 
                decisão de confiar em Deus apesar delas.
              </p>
              <p className="text-gray-700 mb-4">
                Hoje, reflita sobre as áreas da sua vida onde você precisa exercitar mais fé. 
                Lembre-se de que Deus tem um plano perfeito para você, mesmo quando não conseguimos 
                enxergar o caminho completo.
              </p>
              <div className="bg-white/80 rounded p-4">
                <p className="text-sm text-gray-600 italic">
                  "Oração para hoje: Senhor, fortalece minha fé e me ajuda a confiar em Ti em 
                  todas as circunstâncias. Que eu possa ser um exemplo de fé para outros. Amém."
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 text-center">
              <Lock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Reflexões Profundas Premium
              </h3>
              <p className="text-gray-600 mb-4">
                Desbloqueie reflexões diárias personalizadas, orações guiadas e estudos bíblicos 
                aprofundados para fortalecer sua jornada espiritual.
              </p>
              <Button 
                onClick={handleAssinarPremium}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
              >
                <Star className="w-4 h-4 mr-2" />
                Assinar Premium - R$ 9,90/mês
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Oração Guiada - CONTROLE DE ACESSO */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Heart className="w-6 h-6 text-purple-500" />
            Oração Guiada
            {!isPremium && <Lock className="w-4 h-4 text-amber-500 ml-2" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPremium ? (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Momento de Oração Pessoal
              </h3>
              <div className="space-y-4">
                <div className="bg-white/80 rounded p-4">
                  <h4 className="font-medium text-gray-800 mb-2">1. Gratidão</h4>
                  <p className="text-sm text-gray-600">
                    "Senhor, obrigado(a) por este novo dia e por todas as bênçãos em minha vida..."
                  </p>
                </div>
                <div className="bg-white/80 rounded p-4">
                  <h4 className="font-medium text-gray-800 mb-2">2. Pedidos</h4>
                  <p className="text-sm text-gray-600">
                    "Peço-Te sabedoria para as decisões de hoje e força para superar os desafios..."
                  </p>
                </div>
                <div className="bg-white/80 rounded p-4">
                  <h4 className="font-medium text-gray-800 mb-2">3. Intercessão</h4>
                  <p className="text-sm text-gray-600">
                    "Abençoa minha família, amigos e todos que precisam do Teu amor e cuidado..."
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 text-center">
              <Lock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Orações Guiadas Premium
              </h3>
              <p className="text-gray-600 mb-4">
                Acesse orações estruturadas para diferentes momentos e necessidades da sua vida espiritual.
              </p>
              <Button 
                onClick={handleAssinarPremium}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
              >
                <Star className="w-4 h-4 mr-2" />
                Assinar Premium - R$ 9,90/mês
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}