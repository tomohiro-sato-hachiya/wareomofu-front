import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import { Stack, Divider } from '@mui/material'
import { PageProps, ThemeDetail, ThesisSummary } from '../../common/interface'
import { handleAxiosError, getPeriod, getDispDatetime } from '../../common/util'
import ThesisComponent from '../../common/components/ThesisComponent'
import Pages from '../../common/components/Pages'
import ThemeReportComponent from './components/ThemeReportComponent'
import {
  GoToSubmitButtonComponent,
  UserButtonComponent,
  GoBackButtonComponent,
  ReportButtonComponent,
} from '../../common/components/ButtonComponents'
import Loading from '../../common/components/Loading'
import FirstPenguinComponent from '../../common/components/FirstPenguinComponent'
import ReportDialogComponent from '../../common/components/ReportDialogComponent'

const Theme: React.FC<PageProps> = (props) => {
  const { isLogined, currentUsername } = props
  const { id } = useParams()
  const [theme, setTheme] = useState<ThemeDetail | null>(null)
  const [theses, setTheses] = useState<ThesisSummary[] | null>(null)
  const [page, setPage] = useState(1)
  const [period, setPeriod] = useState(getPeriod())
  const [isReporting, setIsReporting] = useState(false)
  const [postedThesisId, setPostedThesisId] = useState<number | null>(null)

  useEffect(() => {
    if (id) {
      const url = `${process.env.REACT_APP_API_URL as string}/theme/${id}`
      axios
        .get(url)
        .then((response) => {
          setTheme(response.data as ThemeDetail)
        })
        .catch((error) => {
          handleAxiosError(error)
          setTheme(null)
        })
    }
  }, [id])

  useEffect(() => {
    setPeriod(getPeriod(theme))
    if (theme) {
      theme.theses.forEach((thesis) => {
        if (thesis.username === currentUsername) {
          setPostedThesisId(thesis.id)
        }
      })
    }
  }, [theme, currentUsername])

  useEffect(() => {
    if (theme !== null) {
      const url = `${process.env.REACT_APP_API_URL as string}/theses/${page}?theme_id=${theme.id}`
      axios
        .get(url)
        .then((response) => {
          setTheses(response.data as ThesisSummary[])
        })
        .catch((error) => {
          handleAxiosError(error)
          setTheses(null)
        })
    } else {
      setTheses(null)
    }
  }, [page, theme])

  const startReporting = () => {
    setIsReporting(true)
  }

  return (
    <div>
      {isLogined && (
        <p>
          {!isReporting && theme && theme.username !== currentUsername && (
            <ReportButtonComponent func={startReporting} label="このテーマを通報する" />
          )}
          <ReportDialogComponent
            isReporting={isReporting}
            setIsReporting={setIsReporting}
            // eslint-disable-next-line react/no-children-prop
            children={<ThemeReportComponent themeId={Number(id)} setIsReporting={setIsReporting} />}
            contentName="テーマ"
          />
        </p>
      )}
      {theme === null && <Loading />}
      {theme !== null && (
        <>
          {!postedThesisId && period.canPost && (
            <GoToSubmitButtonComponent to={`/thesis/create/${theme.id}`} label="小論文を投稿する" />
          )}
          {postedThesisId && <Link to={`/theses/${postedThesisId}`}>投稿した小論文</Link>}
          <h2>{theme.title}</h2>
          <h3>投稿者</h3>
          <UserButtonComponent username={theme.username} />
          <h3>投稿日時</h3>
          {getDispDatetime(theme.created_at)}
          <h3>受付期間</h3>
          {period.str}
          {!period.canPost && <p>投稿受付期間外</p>}
          <h3>説明文</h3>
          <div className="multi-line">{theme.description}</div>
          <h3>字数制限</h3>
          {theme.min_length} ~ {theme.max_length}字
          <div className="center-area">
            <h3>投稿済み小論文一覧</h3>
            <Pages
              url={`${process.env.REACT_APP_API_URL as string}/pages/theses?theme_id=${theme.id}`}
              page={page}
              setPage={setPage}
            />
            <div className="left-area">
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
                      themes={[
                        {
                          id: theme.id,
                          title: theme.title,
                          username: theme.username || '',
                          start_datetime: theme.start_datetime,
                          expire_datetime: theme.expire_datetime,
                          theses: theme.theses,
                          created_at: theme.created_at,
                        },
                      ]}
                      created_at={thesis.created_at}
                    />
                  ))}
                </Stack>
              )}
            </div>
          </div>
        </>
      )}
      {(theses === null || theses.length === 0) && <FirstPenguinComponent label="小論文" />}
      <br />
      <div className="center-area">
        <GoBackButtonComponent to="/themes" label="一覧へ戻る" />
      </div>
    </div>
  )
}

export default Theme
