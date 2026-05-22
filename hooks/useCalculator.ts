'use client'
import { useState, useCallback } from 'react'

type Op = '+' | '-' | '×' | '÷' | null

export function useCalculator() {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState<string | null>(null)
  const [op, setOp] = useState<Op>(null)
  const [resetNext, setResetNext] = useState(false)

  const currentValue = parseFloat(display.replace(',', '.')) || 0

  const pressDigit = useCallback((d: string) => {
    setDisplay(cur => {
      if (resetNext) { setResetNext(false); return d }
      if (cur === '0' && d !== '.') return d
      if (d === '.' && cur.includes('.')) return cur
      if (cur.length >= 12) return cur
      return cur + d
    })
  }, [resetNext])

  const pressOp = useCallback((o: Op) => {
    if (op && prev !== null && !resetNext) {
      // chain: evaluate first
      const a = parseFloat(prev), b = parseFloat(display)
      let r = a
      if (op === '+') r = a + b
      if (op === '-') r = a - b
      if (op === '×') r = a * b
      if (op === '÷') r = b !== 0 ? a / b : 0
      const res = String(parseFloat(r.toFixed(8)))
      setDisplay(res)
      setPrev(res)
    } else {
      setPrev(display)
    }
    setOp(o)
    setResetNext(true)
  }, [display, op, prev, resetNext])

  const evaluate = useCallback(() => {
    if (!op || prev === null) return parseFloat(display)
    const a = parseFloat(prev), b = parseFloat(display)
    let r = a
    if (op === '+') r = a + b
    if (op === '-') r = a - b
    if (op === '×') r = a * b
    if (op === '÷') r = b !== 0 ? a / b : 0
    const res = parseFloat(r.toFixed(8))
    setDisplay(String(res))
    setPrev(null)
    setOp(null)
    setResetNext(true)
    return res
  }, [display, op, prev])

  const clear = useCallback(() => {
    setDisplay('0'); setPrev(null); setOp(null); setResetNext(false)
  }, [])

  const backspace = useCallback(() => {
    setDisplay(cur => cur.length <= 1 ? '0' : cur.slice(0, -1))
  }, [])

  const toggleSign = useCallback(() => {
    setDisplay(cur => cur.startsWith('-') ? cur.slice(1) : '-' + cur)
  }, [])

  const percent = useCallback(() => {
    setDisplay(cur => String(parseFloat((parseFloat(cur) / 100).toFixed(8))))
  }, [])

  const reset = useCallback(() => {
    setDisplay('0'); setPrev(null); setOp(null); setResetNext(false)
  }, [])

  return { display, op, pressDigit, pressOp, evaluate, clear, backspace, toggleSign, percent, reset, currentValue }
}
