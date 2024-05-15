import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { TextareaAutosize } from '@mui/material'
import { Auth } from 'aws-amplify'
import {
  PageProps,
  ThemeDetail,
  ThesisBase,
  AuthBase,
  ThesisSummary,
  ThesisDefaultConstant,
} from '../../common/interface'
import Loading from '../../common/components/Loading'
import NeedLogin from '../../common/components/NeedLogin'
import { handleAxiosError, getPeriod, confirmBeforePost } from '../../common/util'
import { SubmitButtonComponent, GoBackButtonComponent } from '../../common/components/ButtonComponents'
import IndicatorComponent from '../../common/components/IndicatorComponent'

interface ThesisCreate extends ThesisBase, AuthBase {
  works_cited: string
}

const CreateThesis: React.FC<PageProps> = (props) => {
  const { isLogined, currentUsername } = props
  const navigate = useNavigate()
  const { themeId } = useParams()
  const [content, setContent] = useState('')
  const [worksCited, setWorksCited] = useState('')
  const [worksCitedMaxLength, setWorksCitedMaxLength] = useState(0)
  const [period, setPeriod] = useState(getPeriod())
  const [backUrl, setBackUrl] = useState('/themes')
  const [canPost, setCanPost] = useState(true)
  const [indicatorFlag, setIndicatorFlag] = useState(false)

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_URL as string}/constant/thesis`
    axios
      .get(url)
      .then((response) => {
        const defaultConstant: ThesisDefaultConstant = response.data as ThesisDefaultConstant
        setWorksCitedMaxLength(defaultConstant.works_cited_max_length)
      })
      .catch((error) => {
        handleAxiosError(error)
      })
  }, [])

  useEffect(() => {
    setBackUrl(themeId ? `/themes/${themeId}` : '/themes')
  }, [themeId])

  const changeContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value)
  }
  const changeWorksCited = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWorksCited(event.target.value)
  }

  const [theme, setTheme] = useState<ThemeDetail | null>(null)
  useEffect(() => {
    if (themeId) {
      const url = `${process.env.REACT_APP_API_URL as string}/theme/${themeId}`
      axios
        .get(url)
        .then((response) => {
          const theme = response.data as ThemeDetail
          let alreadyPosted = false
          theme.theses.forEach((thesis) => {
            if (thesis.username === currentUsername) {
              alreadyPosted = true
            }
          })
          if (alreadyPosted) {
            alert('指定のテーマに対して、すでに小論文を投稿済みです')
            setCanPost(false)
          } else {
            setTheme(theme)
          }
        })
        .catch((error) => {
          handleAxiosError(error)
        })
    }
  }, [themeId, currentUsername])

  useEffect(() => {
    setPeriod(getPeriod(theme))
  }, [theme])

  const create = async () => {
    if (confirmBeforePost()) {
      setIndicatorFlag(true)
    } else {
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = await Auth.currentAuthenticatedUser()
    const cognitoUser = await Auth.userSession(user)
    const accessToken = cognitoUser.getAccessToken().getJwtToken()
    const params: ThesisCreate = {
      theme_id: Number(themeId),
      content,
      works_cited: worksCited,
      access_token: accessToken,
    }
    const url = `${process.env.REACT_APP_API_URL as string}/thesis/create`
    axios
      .post(url, params)
      .then((response) => {
        const thesis = response.data as ThesisSummary
        alert('投稿に成功しました')
        navigate(`/theses/${thesis.id}`, { replace: true })
      })
      .catch((error) => {
        handleAxiosError(error)
      })
      .finally(() => {
        setIndicatorFlag(false)
      })
  }

  return (
    <div>
      {indicatorFlag && <IndicatorComponent />}
      <h2>小論文投稿</h2>
      {theme === null && <Loading />}
      {isLogined && (
        <>
          {canPost && (
            <div className="create-area">
              {theme !== null && (
                <>
                  <h3>テーマ: {theme.title}</h3>
                  <p>投稿受付期間: {period.str}</p>
                </>
              )}
              {theme !== null && period.canPost && (
                <>
                  <p>
                    本文字数制限: {theme.min_length} ~ {theme.max_length}字(入力文字数: {content.length}字)
                  </p>
                  <TextareaAutosize
                    value={content}
                    placeholder="本文"
                    minLength={theme.min_length}
                    maxLength={theme.max_length}
                    onChange={changeContent}
                    className="text-area"
                  />
                  <br />
                  <p>
                    参考文献字数制限: 0 ~ {worksCitedMaxLength}字(入力文字数: {worksCited.length}字)
                  </p>
                  <TextareaAutosize
                    value={worksCited}
                    placeholder="参考文献"
                    minLength={0}
                    maxLength={worksCitedMaxLength}
                    onChange={changeWorksCited}
                    className="text-area"
                  />
                  <br />
                  <div className="right-area">
                    <SubmitButtonComponent func={create} />
                  </div>
                </>
              )}
            </div>
          )}
          {theme !== null && !period.canPost && <p>投稿受付期間外です</p>}
          {!canPost && <p>何らかの理由(指定のテーマに対して小論文をすでに投稿済みなど)により、投稿ができません</p>}
        </>
      )}
      {!isLogined && <NeedLogin />}
      <div className="center-area">
        <GoBackButtonComponent to={backUrl} label="テーマへ戻る" />
      </div>
    </div>
  )
}

export default CreateThesis
