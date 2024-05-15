import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@mui/material'
import { PageProps, ThesisDetail, ThemeSummary } from '../../common/interface'
import Loading from '../../common/components/Loading'
import { handleAxiosError, getSummary, getDispDatetime } from '../../common/util'
import ThesisReportComponent from './components/ThesisReportComponent'
import FavoriteThesisComponent from './components/FavoriteThesisComponent'
import CommentsComponent from './components/comment/CommentsComponent'
import CreateCommentComponent from './components/comment/CreateCommentComponent'
import {
  UserButtonComponent,
  GoBackButtonComponent,
  ReportButtonComponent,
} from '../../common/components/ButtonComponents'
import ReportDialogComponent from '../../common/components/ReportDialogComponent'

const Thesis: React.FC<PageProps> = (props) => {
  const { isLogined, currentUsername } = props
  const { id } = useParams()
  const [thesis, setThesis] = useState<ThesisDetail | null>(null)

  useEffect(() => {
    if (id) {
      const url = `${process.env.REACT_APP_API_URL as string}/thesis/${id}`
      axios
        .get(url)
        .then((response) => {
          setThesis(response.data as ThesisDetail)
        })
        .catch((error) => {
          handleAxiosError(error)
        })
    }
  }, [id])

  const [theme, setTheme] = useState<ThemeSummary | null>(null)
  useEffect(() => {
    if (thesis !== null) {
      const url = `${process.env.REACT_APP_API_URL as string}/theme/${thesis.theme_id}`
      axios
        .get(url)
        .then((response) => {
          setTheme(response.data as ThemeSummary)
        })
        .catch((error) => {
          handleAxiosError(error)
        })
    }
  }, [thesis])

  const [isReporting, setIsReporting] = useState(false)

  const startReporting = () => {
    setIsReporting(true)
  }

  return (
    <div>
      {isLogined && thesis && thesis.username !== currentUsername && (
        <>
          {!isReporting && id && <ReportButtonComponent func={startReporting} label="この小論文を通報する" />}
          {isReporting && id && (
            <ReportDialogComponent
              isReporting={isReporting}
              setIsReporting={setIsReporting}
              // eslint-disable-next-line react/no-children-prop
              children={<ThesisReportComponent thesisId={Number(id)} setIsReporting={setIsReporting} />}
              contentName="小論文"
            />
          )}
          <br />
        </>
      )}
      {(thesis === null || theme === null) && <Loading />}
      {thesis !== null && theme !== null && (
        <>
          <h2>{getSummary(thesis.content)}</h2>
          <h3>
            テーマ: <Link to={`/themes/${thesis.theme_id}`}>{theme.title}</Link>
          </h3>
          <h3>投稿者</h3>
          <UserButtonComponent username={thesis.username} />
          <h3>投稿日時</h3>
          {getDispDatetime(thesis.created_at)}
          <h3>本文</h3>
          <div className="multi-line">{thesis.content}</div>
          <h3>参考文献</h3>
          <div className="multi-line">{thesis.works_cited}</div>
          <h3>お気に入り登録</h3>
          <FavoriteThesisComponent thesisId={Number(id)} isLogined={isLogined} />
          {thesis !== null && <> &times; {thesis.favorites.length}</>}
          <div>
            <h3>コメント</h3>
            {thesis.id && (
              <>
                <CreateCommentComponent thesisId={thesis.id} isLogined={isLogined} />
                <CommentsComponent thesisId={thesis.id} currentUsername={currentUsername || ''} isLogined={isLogined} />
              </>
            )}
          </div>
        </>
      )}
      <br />
      <div className="center-area">
        <GoBackButtonComponent to="/" label="一覧へ戻る" />
      </div>
    </div>
  )
}

export default Thesis
