import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { TextareaAutosize, TextField } from '@mui/material'
import { Auth } from 'aws-amplify'
import { PageProps, ThemeBase, AuthBase, ThesisDefaultConstant, ThemeSummary } from '../../common/interface'
import Loading from '../../common/components/Loading'
import NeedLogin from '../../common/components/NeedLogin'
import { handleAxiosError, confirmBeforePost } from '../../common/util'
import DatetimeInputComponent from '../../common/components/DatetimeInputComponent'
import { SubmitButtonComponent, GoBackButtonComponent } from '../../common/components/ButtonComponents'
import IndicatorComponent from '../../common/components/IndicatorComponent'

interface ThemeDefaultConstant {
  title_max_length: number
  description_max_length: number
}

interface ThemeCreate extends ThemeBase, AuthBase {
  description: string
  min_length: number
  max_length: number | null
}

const CreateTheme: React.FC<PageProps> = (props) => {
  const { isLogined } = props
  const navigate = useNavigate()
  const [themeDefaultConstant, setThemeDefaultConstant] = useState<ThemeDefaultConstant | null>(null)
  const [thesisDefaultConstant, setThesisDefaultConstant] = useState<ThesisDefaultConstant | null>(null)
  const [indicatorFlag, setIndicatorFlag] = useState(false)

  useEffect(() => {
    const themeConstantUrl = `${process.env.REACT_APP_API_URL as string}/constant/theme`
    axios
      .get(themeConstantUrl)
      .then((response) => {
        setThemeDefaultConstant(response.data as ThemeDefaultConstant)
      })
      .catch((error) => {
        handleAxiosError(error)
      })
    const thesisConstantUrl = `${process.env.REACT_APP_API_URL as string}/constant/thesis`
    axios
      .get(thesisConstantUrl)
      .then((response) => {
        setThesisDefaultConstant(response.data as ThesisDefaultConstant)
      })
      .catch((error) => {
        handleAxiosError(error)
      })
  }, [])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [minLength, setMinLength] = useState(400)
  const [maxLength, setMaxLength] = useState<number | null>(800)
  const [startDatetime, setStartDatetime] = useState<string | null>(null)
  const [expireDatetime, setExpireDatetime] = useState<string | null>(null)
  const [startDatetimeIsSet, setStartDatetimeIsSet] = useState(false)
  const plus1Week = new Date()
  plus1Week.setDate(plus1Week.getDate() + 7)
  const [startDatetimeYear, setStartDatetimeYear] = useState(plus1Week.getFullYear())
  const [startDatetimeMonth, setStartDatetimeMonth] = useState(plus1Week.getMonth() + 1)
  const [startDatetimeDate, setStartDatetimeDate] = useState(plus1Week.getDate())
  const [startDatetimeHour, setStartDatetimeHour] = useState(0)
  const [startDatetimeMinute, setStartDatetimeMinute] = useState(0)
  const [startDatetimeSecond, setStartDatetimeSecond] = useState(0)
  const [expireDatetimeIsSet, setExpireDatetimeIsSet] = useState(false)
  const plus2Week = new Date()
  plus2Week.setDate(plus2Week.getDate() + 7 * 2)
  const [expireDatetimeYear, setExpireDatetimeYear] = useState(plus2Week.getFullYear())
  const [expireDatetimeMonth, setExpireDatetimeMonth] = useState(plus2Week.getMonth() + 1)
  const [expireDatetimeDate, setExpireDatetimeDate] = useState(plus2Week.getDate())
  const [expireDatetimeHour, setExpireDatetimeHour] = useState(0)
  const [expireDatetimeMinute, setExpireDatetimeMinute] = useState(0)
  const [expireDatetimeSecond, setExpireDatetimeSecond] = useState(0)

  const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const changeDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value)
  }

  const changeMinLength = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinLength(Number(event.target.value))
  }

  const changeMaxLength = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxLength(Number(event.target.value))
  }

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

    const params: ThemeCreate = {
      title,
      description,
      min_length: minLength,
      max_length: maxLength,
      start_datetime: startDatetime,
      expire_datetime: expireDatetime,
      access_token: accessToken,
    }
    const url = `${process.env.REACT_APP_API_URL as string}/theme/create`
    axios
      .post(url, params)
      .then((response) => {
        const theme = response.data as ThemeSummary
        alert('投稿に成功しました')
        navigate(`/themes/${theme.id}`, { replace: true })
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
      <h2>テーマ投稿</h2>
      {isLogined && (
        <div className="create-area">
          {themeDefaultConstant === null || (thesisDefaultConstant === null && <Loading />)}
          {themeDefaultConstant !== null && thesisDefaultConstant !== null && (
            <>
              <p>
                タイトルの最大文字数: {themeDefaultConstant.title_max_length}字(入力文字数: {title.length}字)
              </p>
              <TextField value={title} label="タイトル" onChange={changeTitle} className="text-form" />
              <p>小論文のデフォルト文字制限: 1 ~ {thesisDefaultConstant.content_max_length}</p>
              <TextField value={minLength} label="小論文最小文字数" onChange={changeMinLength} type="number" />
              &nbsp;~&nbsp;
              <TextField value={maxLength} label="小論文最大文字数" onChange={changeMaxLength} type="number" />
              <br />
              <p>小論文受付開始日時(日本標準時)</p>
              <DatetimeInputComponent
                isSet={startDatetimeIsSet}
                setIsSet={setStartDatetimeIsSet}
                year={startDatetimeYear}
                setYear={setStartDatetimeYear}
                month={startDatetimeMonth}
                setMonth={setStartDatetimeMonth}
                date={startDatetimeDate}
                setDate={setStartDatetimeDate}
                hour={startDatetimeHour}
                setHour={setStartDatetimeHour}
                minute={startDatetimeMinute}
                setMinute={setStartDatetimeMinute}
                second={startDatetimeSecond}
                setSecond={setStartDatetimeSecond}
                setDatetimeStr={setStartDatetime}
              />
              <br />
              <p>小論文受付終了日時(日本標準時)</p>
              <DatetimeInputComponent
                isSet={expireDatetimeIsSet}
                setIsSet={setExpireDatetimeIsSet}
                year={expireDatetimeYear}
                setYear={setExpireDatetimeYear}
                month={expireDatetimeMonth}
                setMonth={setExpireDatetimeMonth}
                date={expireDatetimeDate}
                setDate={setExpireDatetimeDate}
                hour={expireDatetimeHour}
                setHour={setExpireDatetimeHour}
                minute={expireDatetimeMinute}
                setMinute={setExpireDatetimeMinute}
                second={expireDatetimeSecond}
                setSecond={setExpireDatetimeSecond}
                setDatetimeStr={setExpireDatetime}
              />
              <br />
              <p>
                説明文の最大文字: {themeDefaultConstant.description_max_length}字(入力文字数: {description.length}字)
              </p>
              <TextareaAutosize
                value={description}
                minLength={1}
                maxLength={themeDefaultConstant.description_max_length}
                onChange={changeDescription}
                className="text-area"
              />
              <div className="right-area">
                <SubmitButtonComponent func={create} />
              </div>
            </>
          )}
        </div>
      )}
      {!isLogined && <NeedLogin />}
      <br />
      <div className="center-area">
        <GoBackButtonComponent to="/themes" label="一覧へ戻る" />
      </div>
    </div>
  )
}

export default CreateTheme
