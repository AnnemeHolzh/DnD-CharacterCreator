"use client"

import React, { useCallback, useRef, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { countWords } from "@/lib/utils/input-validation"
import { cn } from "@/lib/utils"

interface WordLimitedTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxWords: number
  showWordCount?: boolean
  onWordCountChange?: (wordCount: number) => void
}

export function WordLimitedTextarea({
  maxWords,
  showWordCount = true,
  onWordCountChange,
  className,
  onPaste,
  onChange,
  value,
  ...props
}: WordLimitedTextareaProps) {
  const [wordCount, setWordCount] = useState(() => 
    value ? countWords(value.toString()) : 0
  )
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const updateWordCount = useCallback((text: string) => {
    const count = countWords(text)
    setWordCount(count)
    onWordCountChange?.(count)
  }, [onWordCountChange])

  const truncateToWordLimit = useCallback((text: string): string => {
    const words = text.trim().split(/\s+/)
    if (words.length <= maxWords) return text
    
    // Truncate to maxWords
    const truncatedWords = words.slice(0, maxWords)
    return truncatedWords.join(' ')
  }, [maxWords])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    updateWordCount(newValue)
    onChange?.(e)
  }, [onChange, updateWordCount])

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    
    const pastedText = e.clipboardData.getData('text/plain')
    const currentValue = value?.toString() || ''
    const cursorPosition = textareaRef.current?.selectionStart || 0
    
    // Insert pasted text at cursor position
    const beforeCursor = currentValue.slice(0, cursorPosition)
    const afterCursor = currentValue.slice(cursorPosition)
    const newValue = beforeCursor + pastedText + afterCursor
    
    // Truncate if needed
    const truncatedValue = truncateToWordLimit(newValue)
    
    // Update the form value directly
    updateWordCount(truncatedValue)
    
    // Create a synthetic change event
    const syntheticEvent = {
      target: {
        value: truncatedValue,
        name: e.currentTarget.name
      }
    } as React.ChangeEvent<HTMLTextAreaElement>
    
    onChange?.(syntheticEvent)
    
    // Set cursor position after the pasted text (or at the end if truncated)
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPosition = Math.min(
          cursorPosition + pastedText.length,
          truncatedValue.length
        )
        textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition)
      }
    }, 0)
  }, [value, onChange, updateWordCount, truncateToWordLimit])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Allow normal typing but prevent adding more words if at limit
    if (wordCount >= maxWords) {
      // Allow backspace, delete, arrow keys, etc.
      const allowedKeys = [
        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End', 'PageUp', 'PageDown', 'Tab', 'Enter'
      ]
      
      // Allow if it's a control key or if we're not at word limit
      if (!allowedKeys.includes(e.key) && wordCount >= maxWords) {
        // Check if this key press would add a new word
        const currentValue = value?.toString() || ''
        const cursorPosition = textareaRef.current?.selectionStart || 0
        
        // If pressing space and we're at word limit, prevent it
        if (e.key === ' ' && wordCount >= maxWords) {
          e.preventDefault()
          return
        }
        
        // For other characters, check if they would create a new word
        const beforeCursor = currentValue.slice(0, cursorPosition)
        const afterCursor = currentValue.slice(cursorPosition)
        const testValue = beforeCursor + e.key + afterCursor
        const testWordCount = countWords(testValue)
        
        if (testWordCount > maxWords) {
          e.preventDefault()
          return
        }
      }
    }
  }, [wordCount, maxWords, value])

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        className={cn(
          "pr-16", // Make room for word counter
          wordCount > maxWords && "border-red-500 focus:border-red-500",
          className
        )}
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        {...props}
      />
      {showWordCount && (
        <div className={cn(
          "absolute right-3 top-3 text-xs",
          wordCount > maxWords 
            ? "text-red-500" 
            : wordCount > maxWords * 0.8 
              ? "text-amber-500" 
              : "text-muted-foreground"
        )}>
          {wordCount}/{maxWords}
        </div>
      )}
    </div>
  )
}