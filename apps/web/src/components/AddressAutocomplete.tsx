import { useEffect, useId, useRef, useState } from 'react'
import { ApiError, suggestAddresses } from '../lib/api'
import type { AddressSuggestion } from '../types/domain'

type AddressAutocompleteProps = {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export default function AddressAutocomplete({
  value,
  onChange,
  label,
  placeholder,
  hint,
  required = false,
  disabled = false,
  className = '',
}: AddressAutocompleteProps) {
  const listId = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  useEffect(() => {
    const trimmed = value.trim()
    if (trimmed.length < 3) {
      setSuggestions([])
      setIsOpen(false)
      setSearchError(null)
      return
    }

    const timer = window.setTimeout(async () => {
      setIsLoading(true)
      setSearchError(null)
      try {
        const results = await suggestAddresses(trimmed)
        setSuggestions(results)
        setIsOpen(results.length > 0)
      } catch (err) {
        setSuggestions([])
        setIsOpen(false)
        if (err instanceof ApiError) {
          setSearchError(err.message)
        }
      } finally {
        setIsLoading(false)
      }
    }, 400)

    return () => window.clearTimeout(timer)
  }, [value])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function selectSuggestion(suggestion: AddressSuggestion) {
    onChange(suggestion.displayName)
    setSuggestions([])
    setIsOpen(false)
  }

  return (
    <div
      ref={wrapperRef}
      className={`address-autocomplete ${className}`.trim()}
    >
      <label>
        {label}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true)
          }}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-autocomplete="list"
        />
        {hint ? <span className="field-hint">{hint}</span> : null}
        {isLoading ? (
          <span className="field-hint">Søker adresser…</span>
        ) : null}
        {searchError ? (
          <span className="field-hint field-hint--error">{searchError}</span>
        ) : null}
      </label>

      {isOpen && suggestions.length > 0 ? (
        <ul id={listId} className="address-suggestions" role="listbox">
          {suggestions.map((suggestion) => (
            <li key={`${suggestion.latitude}-${suggestion.longitude}-${suggestion.displayName}`}>
              <button
                type="button"
                role="option"
                className="address-suggestion-item"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(suggestion)}
              >
                {suggestion.displayName}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
