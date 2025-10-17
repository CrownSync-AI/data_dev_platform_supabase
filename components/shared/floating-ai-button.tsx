'use client'

import { Bot, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function FloatingAIButton() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isChatPage = pathname === '/dashboard/chat'
  const isEmbeddedMode = searchParams.get('mode') === 'embedded'

  const handleClick = () => {
    if (isChatPage) {
      // Go back to previous page or dashboard
      router.back()
    }
  }

  if (isChatPage) {
    // Hide back button in embedded mode
    if (isEmbeddedMode) {
      return null
    }
    
    // Back button on chat page - positioned higher to avoid input area
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="lg"
              onClick={handleClick}
              className="fixed top-6 left-6 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90 z-50"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Go Back</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-2">
            <p>Go Back</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // AI Assistant button on other pages
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/dashboard/chat">
            <Button
              size="lg"
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90 z-50"
            >
              <Bot className="h-6 w-6" />
              <span className="sr-only">AI Assistant</span>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="left" className="mr-2">
          <p>AI Assistant</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}