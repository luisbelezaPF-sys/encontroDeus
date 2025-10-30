"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Crown, X, Star, Check } from 'lucide-react'
import ConfirmWhatsAppButton from '@/components/ConfirmWhatsAppButton'

interface PopupCobrancaProps {
  mensagem: string
  onAssinar: () => void
  onFechar: () => void
}

export default function PopupCobranca({ mensagem, onAssinar, onFechar }: PopupCobrancaProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-8 w-8 p-0"
            onClick={onFechar}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          
          <CardTitle className="text-xl text-gray-800">
            Acesso Premium Necessário
          </CardTitle>
          
          <CardDescription className="text-base">
            {mensagem}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Benefícios Premium */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              O que você ganha com o Premium:
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                Reflexões profundas e exclusivas
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                Orações guiadas personalizadas
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                Estudos bíblicos aprofundados
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                Experiência sem anúncios
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                Conteúdo atualizado diariamente
              </div>
            </div>
          </div>
          
          {/* Preço */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 text-center">
            <p className="text-sm text-amber-700 mb-1">Apenas</p>
            <p className="text-3xl font-bold text-gray-800 mb-1">R$ 9,90</p>
            <p className="text-sm text-gray-600">por mês • Cancele quando quiser</p>
          </div>
          
          {/* Botões de Ação */}
          <div className="space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3"
              onClick={onAssinar}
            >
              <Crown className="w-4 h-4 mr-2" />
              Assinar Premium Agora
            </Button>
            
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">
                Já fez o pagamento?
              </p>
              <ConfirmWhatsAppButton />
            </div>
            
            <Button 
              variant="ghost" 
              className="w-full text-gray-500 hover:text-gray-700"
              onClick={onFechar}
            >
              Continuar com conta gratuita
            </Button>
          </div>
          
          {/* Garantia */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              🔒 Pagamento 100% seguro via PagBank
            </p>
            <p className="text-xs text-gray-500">
              💝 Garantia de 7 dias ou seu dinheiro de volta
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}