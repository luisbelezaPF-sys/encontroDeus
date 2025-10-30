"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Cross, Shield, Lock } from 'lucide-react'
import PainelAdmin from '@/components/PainelAdmin'

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Verificar se é admin
        const { data: userMeta } = await supabase
          .from('users_meta')
          .select('role')
          .eq('id', user.id)
          .single()

        if (userMeta?.role === 'admin') {
          setUser(user)
          setIsAdmin(true)
        }
      }
    } catch (error) {
      console.error('Erro ao verificar acesso admin:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password
      })

      if (error) throw error

      if (data.user) {
        // Verificar se é admin
        const { data: userMeta } = await supabase
          .from('users_meta')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (userMeta?.role === 'admin') {
          setUser(data.user)
          setIsAdmin(true)
        } else {
          setLoginError('Acesso negado. Apenas administradores podem acessar esta área.')
          await supabase.auth.signOut()
        }
      }
    } catch (error: any) {
      setLoginError(error.message || 'Erro ao fazer login')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
    setLoginForm({ email: '', password: '' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  // Se é admin autenticado, mostrar painel
  if (isAdmin && user) {
    return <PainelAdmin />
  }

  // Tela de login admin
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-blue-100">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-gray-800">Acesso Administrativo</CardTitle>
          <CardDescription>
            Área restrita para administradores do sistema
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email do Administrador</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@encontro.com"
                  className="pl-10"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="admin-password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Senha do administrador"
                  className="pl-10"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              <Shield className="w-4 h-4 mr-2" />
              Acessar Painel Admin
            </Button>
          </form>
          
          {loginError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 text-center">{loginError}</p>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-700 text-center">
                🔒 Área restrita para administradores autorizados
              </p>
              <p className="text-xs text-amber-600 text-center mt-1">
                Credenciais padrão: admin@encontro.com / zelokinho25
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}