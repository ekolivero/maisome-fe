'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import TextareaAutosize from 'react-textarea-autosize'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowUpIcon, Sparkles } from "lucide-react"
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit"
import { cn } from "@/lib/utils"
import { generateSmartFilters } from "../actions/ai-smart-filters"
import { components } from "@/app/types/schema"

export default function SmartFilter({
    location
}: {
    location: components["schemas"]["Location"];
}) {
    const [input, setInput] = useState<string>('')
    const { formRef, onKeyDown } = useEnterSubmit()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await generateSmartFilters(input, location.id)
        setInput('')
    }

    return (
        <TooltipProvider>
            <form ref={formRef} onSubmit={handleSubmit} className="w-full mx-auto px-4 space-y-2">
                <div className="flex items-center space-x-2 text-sm font-medium text-primary">
                    <Sparkles className="w-4 h-4" />
                    <span>Il nostro filtro AI intelligente</span>
                </div>
                <div className="relative flex items-center w-full overflow-hidden bg-white border border-zinc-200 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all duration-300">
                    <TextareaAutosize
                        tabIndex={0}
                        onKeyDown={onKeyDown}
                        placeholder="Decrivi la tua casa dei sogni o il motivo per cui stai cercando una nuova casa, noi ti aiuteremo a trovarla..."
                        className="min-h-[60px] w-full resize-none py-4 pl-4 pr-12 bg-transparent placeholder:text-zinc-400 focus:outline-none text-sm"
                        autoFocus
                        spellCheck={false}
                        autoComplete="off"
                        autoCorrect="off"
                        name="message"
                        rows={3}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={input.trim() === ''}
                                    className={cn(
                                        "bg-primary text-primary-foreground shadow-none rounded-full w-8 h-8 p-0 flex items-center justify-center transition-all duration-300",
                                        input.trim() === '' ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"
                                    )}
                                >
                                    <ArrowUpIcon className="w-4 h-4" />
                                    <span className="sr-only">Send message</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Send message</TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </form>
        </TooltipProvider>
    )
}