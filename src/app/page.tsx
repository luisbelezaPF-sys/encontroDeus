"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Cross, BookOpen, Heart, Users, Star, ArrowRight, Loader2 } from 'lucide-react'
import AuthForm from '@/components/AuthForm'
import PainelUsuario from '@/components/PainelUsuario'
import PopupCobranca from '@/components/PopupCobranca'
import { verificarStatusAssinatura } from '@/lib/subscription'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [statusAssinatura, setStatusAssinatura] = useState<any>(null)
  const [progressoBiblico, setProgressoBiblico] = useState(0)

  useEffect(() => {
    // Verificar usuário logado
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        // Verificar status da assinatura
        const status = await verificarStatusAssinatura(user.id)
        setStatusAssinatura(status)
        
        // Buscar progresso bíblico
        const { data: userMeta } = await supabase
          .from('users_meta')
          .select('progresso_biblico')
          .eq('id', user.id)
          .single()
        
        if (userMeta) {
          setProgressoBiblico(userMeta.progresso_biblico || 0)
        }
      }
      
      setLoading(false)
    }

    checkUser()

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        const status = await verificarStatusAssinatura(session.user.id)
        setStatusAssinatura(status)
      } else {
        setStatusAssinatura(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleAssinarAgora = () => {
    // Redirecionar para PagBank
    window.open('https://pag.ae/81aj-zE2K', '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se usuário está logado, mostrar painel
  if (user) {
    return (
      <>
        <PainelUsuario user={user} statusAssinatura={statusAssinatura} />
        {statusAssinatura?.mostrarPopup && (
          <PopupCobranca 
            mensagem={statusAssinatura.mensagemPopup}
            onAssinar={handleAssinarAgora}
            onFechar={() => setStatusAssinatura({...statusAssinatura, mostrarPopup: false})}
          />
        )}
      </>
    )
  }

  // Se está mostrando formulário de auth
  if (showAuth) {
    return <AuthForm onSuccess={() => setShowAuth(false)} />
  }

  // Página inicial para visitantes
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
                <p className="text-sm text-gray-600">com Deus</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={() => setShowAuth(true)}
            >
              Entrar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Cross className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Sua Jornada Espiritual
              <span className="block text-blue-600">Diária com Deus</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Reflexões profundas, orações guiadas e versículos inspiradores para fortalecer sua fé todos os dias
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-full shadow-lg"
              onClick={() => setShowAuth(true)}
            >
              <Heart className="w-5 h-5 mr-2" />
              Começar Jornada Gratuita
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-amber-400 text-amber-700 hover:bg-amber-50 px-8 py-3 rounded-full"
              onClick={handleAssinarAgora}
            >
              <Star className="w-5 h-5 mr-2" />
              Assinar Premium
            </Button>
          </div>

          {/* Progress Bar */}
          <Card className="max-w-md mx-auto bg-white/70 backdrop-blur-sm border-blue-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Seu Progresso Bíblico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Progress value={progressoBiblico} className="h-3" />
                <p className="text-sm text-gray-600">
                  {progressoBiblico}% da sua jornada espiritual completada
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            O que você encontrará
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-gray-800">Versículos Diários</CardTitle>
                <CardDescription>
                  Versículos inspiradores selecionados especialmente para cada dia
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-gray-800">Orações Guiadas</CardTitle>
                <CardDescription>
                  Momentos de oração estruturados para diferentes necessidades
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-gray-800">Personagens Bíblicos</CardTitle>
                <CardDescription>
                  Conheça histórias inspiradoras de grandes figuras da Bíblia
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Premium Preview */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gradient-to-r from-amber-50 to-blue-50 border-2 border-amber-200">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800">Área Premium</CardTitle>
              <CardDescription className="text-lg">
                Desbloqueie conteúdo exclusivo e aprofunde sua fé
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">✨ Reflexões Profundas</h4>
                  <p className="text-sm text-gray-600">Conteúdo exclusivo para crescimento espiritual</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">🙏 Orações Especiais</h4>
                  <p className="text-sm text-gray-600">Momentos de oração para situações específicas</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">📚 Estudos Bíblicos</h4>
                  <p className="text-sm text-gray-600">Análises detalhadas das Escrituras</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">💝 Sem Anúncios</h4>
                  <p className="text-sm text-gray-600">Experiência completa e sem interrupções</p>
                </div>
              </div>
              
              <div className="bg-white/80 rounded-lg p-4 mb-6">
                <p className="text-sm text-amber-700 font-medium mb-2">
                  🎁 Teste Grátis por 7 dias
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  Depois apenas R$ 9,90/mês
                </p>
              </div>
              
              <Button 
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3 rounded-full shadow-lg"
                onClick={() => setShowAuth(true)}
              >
                Começar Teste Grátis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-blue-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Cross className="w-4 h-4 text-amber-300" />
            </div>
            <span className="text-lg font-semibold text-gray-800">Encontro Diário com Deus</span>
          </div>
          <p className="text-gray-600 text-sm">
            © 2024 Encontro Diário com Deus. Fortalecendo sua fé, um dia de cada vez.
          </p>
        </div>
      </footer>
    </div>
  )
}