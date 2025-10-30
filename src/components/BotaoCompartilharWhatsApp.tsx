"use client"

import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'

interface BotaoCompartilharWhatsAppProps {
  conteudo: string
  link: string
}

export default function BotaoCompartilharWhatsApp({ conteudo, link }: BotaoCompartilharWhatsAppProps) {
  const handleCompartilhar = () => {
    const mensagem = encodeURIComponent(
      `${conteudo}\n\n` +
      `🙏 Compartilhado via: Encontro Diário com Deus\n` +
      `${link}\n\n` +
      `Venha fazer parte da sua jornada espiritual diária! ✨`
    )
    
    const url = `https://api.whatsapp.com/send?text=${mensagem}`
    window.open(url, '_blank')
  }

  return (
    <Button 
      onClick={handleCompartilhar}
      className="w-full bg-green-600 hover:bg-green-700 text-white"
    >
      <Share2 className="w-4 h-4 mr-2" />
      Compartilhar no WhatsApp
    </Button>
  )
}