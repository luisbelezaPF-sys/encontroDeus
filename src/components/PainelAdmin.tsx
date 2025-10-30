"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Cross, Users, Crown, DollarSign, Search, Shield, CheckCircle, XCircle } from 'lucide-react'
import { ativarAssinatura, desativarAssinatura } from '@/lib/subscription'

export default function PainelAdmin() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    usuariosAtivos: 0,
    usuariosTrial: 0,
    receita: 0
  })

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      // Buscar usuários
      const { data: usuariosData } = await supabase
        .from('users_meta')
        .select('*')
        .order('created_at', { ascending: false })

      if (usuariosData) {
        setUsuarios(usuariosData)
        
        // Calcular estatísticas
        const totalUsuarios = usuariosData.length
        const usuariosAtivos = usuariosData.filter(u => u.status_assinatura === 'ativo').length
        const usuariosTrial = usuariosData.filter(u => u.status_assinatura === 'trial').length
        const receita = usuariosAtivos * 9.90

        setStats({
          totalUsuarios,
          usuariosAtivos,
          usuariosTrial,
          receita
        })
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAtivarPremium = async (userId: string) => {
    try {
      const sucesso = await ativarAssinatura(userId)
      if (sucesso) {
        await carregarDados()
        alert('Premium ativado com sucesso!')
      } else {
        alert('Erro ao ativar premium')
      }
    } catch (error) {
      console.error('Erro ao ativar premium:', error)
      alert('Erro ao ativar premium')
    }
  }

  const handleDesativarPremium = async (userId: string) => {
    try {
      const sucesso = await desativarAssinatura(userId)
      if (sucesso) {
        await carregarDados()
        alert('Premium desativado com sucesso!')
      } else {
        alert('Erro ao desativar premium')
      }
    } catch (error) {
      console.error('Erro ao desativar premium:', error)
      alert('Erro ao desativar premium')
    }
  }

  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      case 'trial':
        return <Badge className="bg-blue-100 text-blue-800">Trial</Badge>
      case 'inativo':
        return <Badge variant="secondary">Inativo</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando painel admin...</p>
        </div>
      </div>
    )
  }

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
                <h1 className="text-xl font-bold text-gray-800">Painel Administrativo</h1>
                <p className="text-sm text-gray-600">Encontro Diário com Deus</p>
              </div>
            </div>
            <Badge className="bg-red-100 text-red-800">
              <Shield className="w-3 h-3 mr-1" />
              Admin
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Estatísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">{stats.totalUsuarios}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Usuários Premium
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{stats.usuariosAtivos}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Usuários em Trial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{stats.usuariosTrial}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-amber-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Receita Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-600">
                R$ {stats.receita.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Usuários */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Gerenciar Usuários</CardTitle>
                <CardDescription>
                  Visualize e gerencie as assinaturas dos usuários
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar usuário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead>Progresso</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuariosFiltrados.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">
                        {usuario.nome}
                        {usuario.role === 'admin' && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Admin
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {usuario.email}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(usuario.status_assinatura)}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${usuario.progresso_biblico || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">
                            {usuario.progresso_biblico || 0}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {usuario.status_assinatura !== 'ativo' && usuario.role !== 'admin' && (
                            <Button
                              size="sm"
                              onClick={() => handleAtivarPremium(usuario.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Ativar
                            </Button>
                          )}
                          
                          {usuario.status_assinatura === 'ativo' && usuario.role !== 'admin' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDesativarPremium(usuario.id)}
                              className="border-red-200 text-red-700 hover:bg-red-50"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Desativar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {usuariosFiltrados.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum usuário encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card className="bg-amber-50 border-amber-200 mt-8">
          <CardHeader>
            <CardTitle className="text-lg text-amber-800">
              Instruções de Uso
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-700">
            <ul className="space-y-2 text-sm">
              <li>• <strong>Ativar Premium:</strong> Ativa a assinatura premium para o usuário</li>
              <li>• <strong>Desativar Premium:</strong> Remove o acesso premium do usuário</li>
              <li>• <strong>Confirmação WhatsApp:</strong> Usuários podem confirmar pagamento via WhatsApp (37) 99836-7198</li>
              <li>• <strong>Progresso:</strong> Mostra o progresso bíblico do usuário baseado em atividades</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}