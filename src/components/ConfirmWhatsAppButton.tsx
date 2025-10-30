"use client"

import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

export default function ConfirmWhatsAppButton() {
  const handleConfirmarPagamento = () => {
    const mensagem = encodeURIComponent(
      'Olá! Acabei de realizar o pagamento do Encontro Diário com Deus 🙏\n\n' +
      'Segue meu comprovante de pagamento para ativação da conta Premium.\n\n' +
      'Obrigado!'
    )
    
    const url = `https://wa.me/5537998367198?text=${mensagem}`
    window.open(url, '_blank')
  }

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleConfirmarPagamento}
      className="border-green-200 text-green-700 hover:bg-green-50"
    >
      <MessageCircle className="w-4 h-4 mr-2" />
      Confirmar pelo WhatsApp
    </Button>
  )
}