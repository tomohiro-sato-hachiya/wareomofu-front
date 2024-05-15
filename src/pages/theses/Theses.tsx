import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { TextField, Select, MenuItem, SelectChangeEvent, Stack, Divider } from '@mui/material'
import Pages from '../../common/components/Pages'
import { ThesisSummary, ThemeSummary } from '../../common/interface'
import ThesisComponent from '../../common/components/ThesisComponent'
import { handleAxiosError, getThemeIdsUrl, convertFreeWordsForSearch } from '../../common/util'
import FirstPenguinComponent from '../../common/components/FirstPenguinComponent'
import { SearchButtonComponent } from '../../common/components/ButtonComponents'

interface sortType {
  label: string
  key: string
}

const sortTypes: sortType[] = [
  {
    label: '投稿日時順(新→古)',
    key: 'NEWER',
  },
  {
    label: '投稿日時順(古→新)',
    key: 'OLDER',
  },
  {
    label: 'お気に入り登録数が多い順',
    key: 'NUM_OF_FAVORITES',
  },
]

const Theses: React.FC = () => {
  const [page, setPage] = useState(1)
  const [theses, setTheses] = useState<ThesisSummary[] | null>(null)
  const [themes, setThemes] = useState<ThemeSummary[] | null>(null)
  const [sortType, setSortType] = useState(0)
  const [sortTypeForSearch, setSortTypeForSearch] = useState(0)
  const [searchParameters, setSearchParameters] = useState('')
  const [freeWords, setFreeWords] = useState('')
  const [freeWordsForSearch, setFreeWordsForSearch] = useState('')
  const changeSortType = (event: SelectChangeEvent) => {
    setSortType(Number(event.target.value))
  }
  const changeFreeWords = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFreeWords(event.target.value)
  }

  const search = () => {
    setSortTypeForSearch(sortType)
    setFreeWordsForSearch(freeWords)
  }

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_URL as string}/theses/${page}${searchParameters}`
    axios
      .get(url)
      .then((response) => {
        setTheses(response.data as ThesisSummary[])
      })
      .catch((error) => {
        handleAxiosError(error)
      })
  }, [page, searchParameters])

  useEffect(() => {
    if (theses) {
      const url = getThemeIdsUrl(theses)
      axios
        .get(url)
        .then((response) => {
          setThemes(response.data as ThemeSummary[])
        })
        .catch((error) => {
          handleAxiosError(error)
        })
    }
  }, [theses])

  useEffect(() => {
    setSearchParameters(`?sort_type=${sortTypeForSearch}${convertFreeWordsForSearch(freeWordsForSearch)}`)
  }, [freeWordsForSearch, sortTypeForSearch])

  return (
    <div>
      <div className="center-area">
        <h2>小論文一覧</h2>
      </div>
      <div className="search-form">
        <h3>検索フォーム</h3>
        <TextField label="フリーワード" value={freeWords} onChange={changeFreeWords} fullWidth />
        <br />
        <h4>ソート順</h4>
        <Select value={sortType.toString()} onChange={changeSortType}>
          {sortTypes.map((st, index) => (
            <MenuItem value={index} key={st.key}>
              {st.label}
            </MenuItem>
          ))}
        </Select>
        <br />
        <div className="right-area">
          <SearchButtonComponent func={search} />
        </div>
      </div>

      <Pages
        url={`${process.env.REACT_APP_API_URL as string}/pages/theses${searchParameters}`}
        page={page}
        setPage={setPage}
      />
      {theses !== null && (
        <Stack direction="column" divider={<Divider orientation="horizontal" flexItem />}>
          {theses.map((thesis) => (
            <ThesisComponent
              key={thesis.id}
              id={thesis.id}
              username={thesis.username}
              theme_id={thesis.theme_id}
              content={thesis.content}
              favorites={thesis.favorites}
              themes={themes}
              created_at={thesis.created_at}
            />
          ))}
        </Stack>
      )}
      {(theses === null || theses.length === 0) && (
        <>
          <FirstPenguinComponent label="小論文" />
          <div className="center-area">
            <Link to="/themes">投稿テーマを探す</Link>
          </div>
        </>
      )}
    </div>
  )
}

export default Theses
