import React, { useState, useEffect } from 'react'
import { Button, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import axios from 'axios'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { handleAxiosError } from '../util'

interface PROPS {
  url: string
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
}

interface CountAndPages {
  count: number
  pages: number[]
}

const Pages: React.FC<PROPS> = (props) => {
  const { url, page, setPage } = props
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)
  const [count, setCount] = useState(0)
  const [pages, setPages] = useState([1])

  const move = (isGoingNext: boolean) => {
    const moveTo = page + (isGoingNext ? 1 : -1)
    setPage(moveTo)
  }
  const changePage = (event: SelectChangeEvent) => {
    setPage(Number(event.target.value))
  }

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        const result = response.data as CountAndPages
        setCount(result.count)
        setPages(result.pages)
      })
      .catch((error) => {
        handleAxiosError(error)
      })
  }, [url])

  useEffect(() => {
    setHasNext(pages.includes(page + 1))
    setHasPrevious(pages.includes(page - 1))
  }, [pages, page])

  return (
    <div className="center-area">
      <p>
        {Math.min((page - 1) * 100 + 1, count)}件目 ~ (総数: {count}件)
      </p>
      <Button
        onClick={() => {
          move(false)
        }}
        disabled={!hasPrevious}
        size="medium"
        className="link-button-area"
      >
        <ArrowBackIcon fontSize="medium" />
        前へ
      </Button>
      <Select labelId="page-label" value={page.toString()} onChange={changePage} sx={{ minWidth: '3rem' }}>
        {pages.map((p) => (
          <MenuItem key={p} value={p.toString()}>
            {p}
          </MenuItem>
        ))}
      </Select>
      <Button
        onClick={() => {
          move(true)
        }}
        disabled={!hasNext}
        size="medium"
        className="link-button-area"
      >
        次へ
        <ArrowForwardIcon fontSize="medium" />
      </Button>
    </div>
  )
}

export default Pages
