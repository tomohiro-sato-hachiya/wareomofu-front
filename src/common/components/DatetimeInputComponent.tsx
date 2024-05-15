import React, { useEffect } from 'react'
import { Checkbox, Select, MenuItem, SelectChangeEvent } from '@mui/material'

interface PROPS {
  isSet: boolean
  setIsSet: React.Dispatch<React.SetStateAction<boolean>>
  year: number
  setYear: React.Dispatch<React.SetStateAction<number>>
  month: number
  setMonth: React.Dispatch<React.SetStateAction<number>>
  date: number
  setDate: React.Dispatch<React.SetStateAction<number>>
  hour: number
  setHour: React.Dispatch<React.SetStateAction<number>>
  minute: number
  setMinute: React.Dispatch<React.SetStateAction<number>>
  second: number
  setSecond: React.Dispatch<React.SetStateAction<number>>
  setDatetimeStr: React.Dispatch<React.SetStateAction<string | null>>
}

const DatetimeInputComponent: React.FC<PROPS> = (props) => {
  const {
    isSet,
    setIsSet,
    year,
    setYear,
    month,
    setMonth,
    date,
    setDate,
    hour,
    setHour,
    minute,
    setMinute,
    second,
    setSecond,
    setDatetimeStr,
  } = props

  const today = new Date()
  const years: number[] = []
  for (let plus = 0; plus < 3; plus += 1) {
    const y = today.getFullYear() + plus
    years.push(y)
  }
  const months: number[] = []
  for (let m = 1; m <= 12; m += 1) {
    months.push(m)
  }
  const dates: number[] = []
  for (let d = 1; d <= 31; d += 1) {
    dates.push(d)
  }
  const hours: number[] = []
  for (let h = 0; h <= 23; h += 1) {
    hours.push(h)
  }
  const minutes: number[] = []
  for (let min = 0; min <= 59; min += 1) {
    minutes.push(min)
  }
  const seconds: number[] = []
  for (let s = 0; s <= 59; s += 1) {
    seconds.push(s)
  }

  const changeIsSet = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSet(event.target.checked)
  }
  const changeYear = (event: SelectChangeEvent) => {
    setYear(Number(event.target.value))
  }
  const changeMonth = (event: SelectChangeEvent) => {
    setMonth(Number(event.target.value))
  }
  const changeDate = (event: SelectChangeEvent) => {
    setDate(Number(event.target.value))
  }
  const changeHour = (event: SelectChangeEvent) => {
    setHour(Number(event.target.value))
  }
  const changeMinute = (event: SelectChangeEvent) => {
    setMinute(Number(event.target.value))
  }
  const changeSecond = (event: SelectChangeEvent) => {
    setSecond(Number(event.target.value))
  }

  useEffect(() => {
    if (!isSet) {
      setDatetimeStr(null)
    } else {
      const yearStr = year.toString().padStart(4, '0')
      const monthStr = month.toString().padStart(2, '0')
      const dateStr = date.toString().padStart(2, '0')
      const hourStr = hour.toString().padStart(2, '0')
      const minuteStr = minute.toString().padStart(2, '0')
      const secondStr = second.toString().padStart(2, '0')
      setDatetimeStr(`${yearStr}-${monthStr}-${dateStr}T${hourStr}:${minuteStr}:${secondStr}+09:00`)
    }
  }, [isSet, year, month, date, hour, minute, second, setDatetimeStr])

  return (
    <>
      <Checkbox checked={isSet} onChange={changeIsSet} />
      <span>設定する</span>
      <br />
      <Select value={year.toString()} onChange={changeYear} disabled={!isSet}>
        {years.map((y) => (
          <MenuItem value={y}>{y}</MenuItem>
        ))}
      </Select>
      /
      <Select value={month.toString()} label="月" onChange={changeMonth} disabled={!isSet}>
        {months.map((m) => (
          <MenuItem value={m}>{m}</MenuItem>
        ))}
      </Select>
      /
      <Select value={date.toString()} onChange={changeDate} disabled={!isSet}>
        {dates.map((d) => (
          <MenuItem value={d}>{d}</MenuItem>
        ))}
      </Select>
      <br />
      <Select value={hour.toString()} onChange={changeHour} disabled={!isSet}>
        {hours.map((h) => (
          <MenuItem value={h}>{h}</MenuItem>
        ))}
      </Select>
      :
      <Select value={minute.toString()} onChange={changeMinute} disabled={!isSet}>
        {minutes.map((min) => (
          <MenuItem value={min}>{min}</MenuItem>
        ))}
      </Select>
      :
      <Select value={second.toString()} onChange={changeSecond} disabled={!isSet}>
        {seconds.map((s) => (
          <MenuItem value={s}>{s}</MenuItem>
        ))}
      </Select>
    </>
  )
}

export default DatetimeInputComponent
