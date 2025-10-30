"use client"

import { useState } from 'react'
import { loginUsuario, registrarUsuario, debugAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestAuth() {
  const [email, setEmail] = useState('teste@exemplo.com')
  const [senha, setSenha] = useState('123456')
  const [nome, setNome] = useState('Usuário Teste')
  const [resultado, setResultado] = useState('')
  const [loading, setLoading] = useState(false)

  const testarRegistro = async () => {
    setLoading(true)
    setResultado('Testando registro...')
    
    try {
      const result = await registrarUsuario(email, senha, nome)
      setResultado(JSON.stringify(result, null, 2))
    } catch (error: any) {
      setResultado(`Erro: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testarLogin = async () => {
    setLoading(true)
    setResultado('Testando login...')
    
    try {
      const result = await loginUsuario(email, senha)
      setResultado(JSON.stringify(result, null, 2))
    } catch (error: any) {
      setResultado(`Erro: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testarDebug = async () => {
    setLoading(true)
    setResultado('Executando debug...')
    
    try {
      const result = await debugAuth()
      setResultado(JSON.stringify(result, null, 2))
    } catch (error: any) {
      setResultado(`Erro: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔧 Teste de Autenticação Supabase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email de teste"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Senha</label>
                <Input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Senha de teste"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <Input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome de teste"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={testarRegistro} 
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                Testar Registro
              </Button>
              <Button 
                onClick={testarLogin} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Testar Login
              </Button>
              <Button 
                onClick={testarDebug} 
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Debug Auth
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📋 Resultado do Teste</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
              {resultado || 'Nenhum teste executado ainda...'}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📝 Instruções</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>1. Testar Registro:</strong> Cria uma nova conta com os dados informados</p>
            <p><strong>2. Testar Login:</strong> Faz login com os dados informados</p>
            <p><strong>3. Debug Auth:</strong> Mostra informações detalhadas sobre a autenticação</p>
            <p className="text-sm text-gray-600 mt-4">
              ⚠️ <strong>Importante:</strong> Abra o console do navegador (F12) para ver logs detalhados
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}