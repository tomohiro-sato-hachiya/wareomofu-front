import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Checkbox, TextField, Select, MenuItem, SelectChangeEvent, Stack, Divider } from '@mui/material'
import Pages from '../../common/components/Pages'
import { ThemeSummary } from '../../common/interface'
import ThemeComponent from '../../common/components/ThemeComponent'
import { handleAxiosError, convertFreeWordsForSearch, convertFlagToBinary } from '../../common/util'
import FirstPenguinComponent from '../../common/components/FirstPenguinComponent'
import { SearchButtonComponent, GoToSubmitButtonComponent } from '../../common/components/ButtonComponents'

interface sortType {
  label: string
  datetimeNullIsEarlierMessage?: string
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
    label: '小論文数が多い順',
    key: 'NUM_OF_THESES',
  },
  {
    label: '投稿受付開始日時順(早→遅)',
    datetimeNullIsEarlierMessage: '投稿受付開始日時が指定されていないものを先頭に表示する',
    key: 'START_EARLIER',
  },
  {
    label: '投稿受付開始日時順(遅→早)',
    datetimeNullIsEarlierMessage: '投稿受付開始日時が指定されていないものを最後に表示する',
    key: 'START_LATER',
  },
  {
    label: '投稿受付終了日時順(早→遅)',
    datetimeNullIsEarlierMessage: '投稿受付終了日時が指定されていないものを最後に表示する',
    key: 'EXPIRE_EARLIER',
  },
  {
    label: '投稿受付終了日時順(遅→早)',
    datetimeNullIsEarlierMessage: '投稿受付終了日時が指定されていないものを先頭に表示する',
    key: 'EXPIRE_LATER',
  },
]

const Themes: React.FC = () => {
  const [page, setPage] = useState(1)
  const [themes, setThemes] = useState<ThemeSummary[] | null>(null)
  const pageUrlBase = `${process.env.REACT_APP_API_URL as string}/pages/themes`
  const [pageUrl, setPageUrl] = useState(pageUrlBase)
  const [excludeNotYet, setExcludeNotYet] = useState(false)
  const [excludeAccepting, setExcludeAccepting] = useState(false)
  const [excludeExpired, setExcludeExpired] = useState(false)
  const [excludeNotYetForSearch, setExcludeNotYetForSearch] = useState(false)
  const [excludeAcceptingForSearch, setExcludeAcceptingForSearch] = useState(false)
  const [excludeExpiredForSearch, setExcludeExpiredForSearch] = useState(false)
  const [freeWords, setFreeWords] = useState('')
  const [freeWordsForSearch, setFreeWordsForSearch] = useState('')
  const [sortType, setSortType] = useState(0)
  const [sortTypeForSearch, setSortTypeForSearch] = useState(0)
  const [datetimeNullIsEarlier, setDatetimeNullIsEarlier] = useState(true)
  const [datetimeNullIsEarlierForSearch, setDatetimeNullIsEarlierForSearch] = useState(true)
  const [datetimeNullIsEarlierMessage, setDatetimeNullIsEarlierMessage] = useState(
    sortTypes[sortType].datetimeNullIsEarlierMessage || ''
  )
  const [searchParameters, setSearchParameters] = useState('')

  const changeExcludeNotYet = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExcludeNotYet(!event.target.checked)
  }
  const changeExcludeAccepting = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExcludeAccepting(!event.target.checked)
  }
  const changeExcludeExpired = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExcludeExpired(!event.target.checked)
  }
  const changeFreeWords = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFreeWords(event.target.value)
  }
  const changeSortType = (event: SelectChangeEvent) => {
    setSortType(Number(event.target.value))
  }
  const changeDatetimeNullIsEarlier = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDatetimeNullIsEarlier(event.target.checked)
  }

  useEffect(() => {
    const message = sortTypes[sortType].datetimeNullIsEarlierMessage || ''
    setDatetimeNullIsEarlierMessage(message)
  }, [sortType])

  const search = () => {
    setExcludeNotYetForSearch(excludeNotYet)
    setExcludeAcceptingForSearch(excludeAccepting)
    setExcludeExpiredForSearch(excludeExpired)
    setFreeWordsForSearch(freeWords)
    setSortTypeForSearch(sortType)
    setDatetimeNullIsEarlierForSearch(datetimeNullIsEarlier)
  }

  useEffect(() => {
    setSearchParameters(
      `?exclude_not_yet=${convertFlagToBinary(excludeNotYetForSearch)}&exclude_accepting=${convertFlagToBinary(
        excludeAcceptingForSearch
      )}&exclude_expired=${convertFlagToBinary(excludeExpiredForSearch)}${convertFreeWordsForSearch(
        freeWordsForSearch
      )}&sort_type=${sortTypeForSearch}&datetime_null_is_earlier=${convertFlagToBinary(datetimeNullIsEarlierForSearch)}`
    )
  }, [
    excludeNotYetForSearch,
    excludeAcceptingForSearch,
    excludeExpiredForSearch,
    freeWordsForSearch,
    sortTypeForSearch,
    datetimeNullIsEarlierForSearch,
  ])

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_URL as string}/themes/${page}${searchParameters}`
    axios
      .get(url)
      .then((response) => {
        setThemes(response.data as ThemeSummary[])
      })
      .catch((error) => {
        handleAxiosError(error)
      })
  }, [page, searchParameters])

  useEffect(() => {
    setPageUrl(`${pageUrlBase}${searchParameters}`)
  }, [searchParameters, pageUrlBase])

  return (
    <div>
      <div className="center-area">
        <h2>テーマ一覧</h2>
      </div>
      <div className="search-form">
        <h3>検索フォーム</h3>
        <h4>小論文の投稿受付ステータス</h4>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-start">
          <div>
            <Checkbox checked={!excludeNotYet} onChange={changeExcludeNotYet} />
            <span>受付前</span>
          </div>
          <div>
            <Checkbox checked={!excludeAccepting} onChange={changeExcludeAccepting} />
            <span>受付中</span>
          </div>
          <div>
            <Checkbox checked={!excludeExpired} onChange={changeExcludeExpired} />
            <span>受付終了</span>
          </div>
        </Stack>
        <br />
        <TextField label="フリーワード" value={freeWords} onChange={changeFreeWords} fullWidth />
        <br />
        <h4>ソート順</h4>
        <Select value={sortType.toString()} onChange={changeSortType} autoWidth={false}>
          {sortTypes.map((st, index) => (
            <MenuItem value={index} key={st.key}>
              {st.label}
            </MenuItem>
          ))}
        </Select>
        {datetimeNullIsEarlierMessage && (
          <>
            <br />
            <Checkbox checked={datetimeNullIsEarlier} onChange={changeDatetimeNullIsEarlier} />
            <span>{datetimeNullIsEarlierMessage}</span>
          </>
        )}
        <br />
        <div className="right-area">
          <SearchButtonComponent func={search} />
        </div>
      </div>

      <br />
      <Pages url={pageUrl} page={page} setPage={setPage} />
      <br />
      <div className="right-area">
        <GoToSubmitButtonComponent to="/theme/create" label="テーマを投稿する" />
      </div>
      {themes !== null && (
        <Stack direction="column" divider={<Divider orientation="horizontal" flexItem />}>
          {themes.map((theme) => (
            <ThemeComponent
              key={theme.id}
              id={theme.id}
              title={theme.title}
              username={theme.username}
              start_datetime={theme.start_datetime}
              expire_datetime={theme.expire_datetime}
              theses={theme.theses}
              created_at={theme.created_at}
            />
          ))}
        </Stack>
      )}
      {(themes === null || themes.length === 0) && <FirstPenguinComponent label="テーマ" />}
    </div>
  )
}

export default Themes
