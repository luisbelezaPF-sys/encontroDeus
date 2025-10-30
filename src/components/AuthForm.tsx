"use client"

import { useState } from 'react'
import { registrarUsuario, loginUsuario } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Cross, Mail, Lock, User, Loader2 } from 'lucide-react'

interface AuthFormProps {
  onSuccess?: () => void
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const nome = formData.get('nome') as string

    try {
      console.log('📝 Iniciando cadastro:', { email, nome })
      
      const result = await registrarUsuario(email, password, nome)
      
      if (result.success) {
        console.log('✅ Cadastro realizado com sucesso')
        setMessage(result.message || 'Conta criada com sucesso!')
        
        if (onSuccess) {
          setTimeout(onSuccess, 2000)
        }
      } else {
        console.error('❌ Erro no cadastro:', result.error)
        setError(result.error || 'Erro ao criar conta')
      }
    } catch (error: any) {
      console.error('❌ Erro inesperado no cadastro:', error)
      setError(error.message || 'Erro inesperado ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      console.log('🔐 Iniciando login:', email)
      
      const result = await loginUsuario(email, password)
      
      if (result.success) {
        console.log('✅ Login realizado com sucesso')
        setMessage(result.message || 'Login realizado com sucesso!')
        
        if (onSuccess) {
          setTimeout(onSuccess, 1000)
        }
      } else {
        console.error('❌ Erro no login:', result.error)
        setError(result.error || 'Erro ao fazer login')
      }
    } catch (error: any) {
      console.error('❌ Erro inesperado no login:', error)
      setError(error.message || 'Erro inesperado ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-blue-100">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Cross className="w-8 h-8 text-amber-300" />
          </div>
          <CardTitle className="text-2xl text-gray-800">Encontro Diário com Deus</CardTitle>
          <CardDescription>
            Entre ou crie sua conta para começar sua jornada espiritual
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar Conta</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="Sua senha"
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-nome">Nome</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-nome"
                      name="nome"
                      type="text"
                      placeholder="Seu nome"
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      className="pl-10"
                      minLength={6}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-700 text-center">
                    🎁 <strong>7 dias grátis</strong> de acesso premium!
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    'Criar Conta Grátis'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          {message && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 text-center">{message}</p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 text-center">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}