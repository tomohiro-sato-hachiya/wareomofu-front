import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, TextField, Checkbox, FormGroup, FormControlLabel } from '@mui/material'
import { Auth } from 'aws-amplify'
import axios from 'axios'
import { handleErrorBriefly, handleAxiosError } from '../../common/util'
import { PageProps, AuthBase } from '../../common/interface'
import NeedLogin from '../../common/components/NeedLogin'
import { GoBackButtonComponent } from '../../common/components/ButtonComponents'
import IndicatorComponent from '../../common/components/IndicatorComponent'

type EmailNotificationSettingCreate = AuthBase

interface EmailNotificationSetting {
  thesis: boolean
  favorite: boolean
  comment: boolean
}

interface EmailNotificationSettingUpdate extends AuthBase, EmailNotificationSetting {}

const Email: React.FC<PageProps> = (props) => {
  const { isLogined } = props
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [previousEmail, setPreviousEmail] = useState('')
  const [currentEmail, setCurrentEmail] = useState('')
  const [code, setCode] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)
  const [isGettingNotificationSetting, setIsGettingNotificationSetting] = useState(true)
  const [emailThesis, setEmailThesis] = useState(true)
  const [emailFavorite, setEmailFavorite] = useState(true)
  const [emailComment, setEmailComment] = useState(true)
  const [indicatorFlag, setIndicatorFlag] = useState(false)

  const getCurrentEmail = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const user = await Auth.currentAuthenticatedUser()
      const attributes = await Auth.userAttributes(user)
      attributes.map((attribute) => {
        if (attribute.getName() === 'email') {
          let value = attribute.getValue()
          for (let index = 1; index < value.length; index += 2) {
            const before = value.slice(0, index)
            const changed = '*'
            const after = value.slice(index + 1)
            value = `${before}${changed}${after}`
          }
          setCurrentEmail(value)
        }
        return true
      })
    } catch (error) {
      setCurrentEmail('')
    }
  }

  const getEmailNotificationSetting = async () => {
    const url = `${process.env.REACT_APP_API_URL as string}/user/email_notification_setting`
    await Auth.currentAuthenticatedUser()
      .then(async (user) => {
        const cognitoUser = await Auth.userSession(user)
        const accessToken = cognitoUser.getAccessToken().getJwtToken()
        const params: EmailNotificationSettingCreate = {
          access_token: accessToken,
        }
        axios
          .post(url, params)
          .then((response) => {
            const setting = response.data as EmailNotificationSetting
            setEmailThesis(setting.thesis)
            setEmailFavorite(setting.favorite)
            setEmailComment(setting.comment)
            setIsGettingNotificationSetting(false)
          })
          .catch((error) => {
            handleAxiosError(error)
          })
      })
      .catch((error) => {
        handleAxiosError(error)
      })
  }

  useEffect(() => {
    if (isLogined) {
      void getCurrentEmail()
      void getEmailNotificationSetting()
    }
  }, [isLogined])

  const changeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const rollback = async () => {
    setIndicatorFlag(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const user = await Auth.currentAuthenticatedUser()
      await Auth.updateUserAttributes(user, { previousEmail })
      alert('検証コードが元のメールにて送られたので、ご確認をお願いします')
      setIndicatorFlag(false)
    } catch (error) {
      handleErrorBriefly(error)
    } finally {
      setIndicatorFlag(false)
    }
  }

  const changeCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value)
  }

  const confirm = async () => {
    setIndicatorFlag(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const user = await Auth.currentAuthenticatedUser()
      setPreviousEmail(currentEmail)
      await Auth.updateUserAttributes(user, { email })
      setIsConfirming(true)
      alert('検証コードがメールにて送られたので、ご確認をお願いします')
    } catch (error) {
      handleErrorBriefly(error)
    } finally {
      setIndicatorFlag(false)
    }
  }

  const validate = async () => {
    setIndicatorFlag(true)
    try {
      await Auth.verifyCurrentUserAttributeSubmit('email', code)
      alert('メールアドレスの変更が完了しました')
      navigate('/themes/', { replace: true })
    } catch (error) {
      handleErrorBriefly(error)
      setCode('')
    } finally {
      setIndicatorFlag(false)
    }
  }

  const submit = () => {
    if (isConfirming) {
      void validate()
    } else {
      void confirm()
    }
  }

  const changeEmailThesis = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailThesis(event.target.checked)
  }

  const changeEmailFavorite = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailFavorite(event.target.checked)
  }

  const changeEmailComment = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailComment(event.target.checked)
  }

  const changeEmailNotificationSetting = async () => {
    setIndicatorFlag(true)
    const url = `${process.env.REACT_APP_API_URL as string}/user/email_notification_setting`
    await Auth.currentAuthenticatedUser()
      .then(async (user) => {
        const cognitoUser = await Auth.userSession(user)
        const accessToken = cognitoUser.getAccessToken().getJwtToken()
        const params: EmailNotificationSettingUpdate = {
          access_token: accessToken,
          thesis: emailThesis,
          favorite: emailFavorite,
          comment: emailComment,
        }
        axios
          .put(url, params)
          .then((response) => {
            const setting = response.data as EmailNotificationSetting
            setEmailThesis(setting.thesis)
            setEmailFavorite(setting.favorite)
            setEmailComment(setting.comment)
            alert('メール通知設定が更新されました')
          })
          .catch((error) => {
            handleAxiosError(error)
          })
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
      <h2>メールアドレス/メール通知設定</h2>
      {isLogined && (
        <>
          <p>現在のメールアドレス: {isConfirming ? previousEmail : currentEmail}</p>
          <div className="create-area">
            {!isConfirming && (
              <TextField
                label="メールアドレスの変更"
                type="email"
                value={email}
                onChange={changeEmail}
                className="text-form"
              />
            )}
            {isConfirming && (
              <>
                <TextField label="検証コード" value={code} onChange={changeCode} />
                <br />
                <div className="right-area">
                  <Button
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={async () => {
                      await rollback()
                    }}
                    variant="contained"
                  >
                    変更を取りやめる
                  </Button>
                </div>
              </>
            )}
            <div className="right-area">
              <Button onClick={submit} variant="contained">
                送信
              </Button>
            </div>
          </div>

          <p>メール通知設定</p>
          <div className="create-area">
            <FormGroup>
              <FormControlLabel disabled control={<Checkbox defaultChecked />} label="重要なメール" />
              <FormControlLabel
                disabled={isGettingNotificationSetting}
                control={<Checkbox checked={emailThesis} onChange={changeEmailThesis} />}
                label="自分が投稿したテーマに小論文が投稿された時"
              />
              <FormControlLabel
                disabled={isGettingNotificationSetting}
                control={<Checkbox checked={emailFavorite} onChange={changeEmailFavorite} />}
                label="自分が投稿した小論文がお気に入り登録された時"
              />
              <FormControlLabel
                disabled={isGettingNotificationSetting}
                control={<Checkbox checked={emailComment} onChange={changeEmailComment} />}
                label="自分が投稿した小論文にコメントが投稿された時"
              />
            </FormGroup>
            <div className="right-area">
              <Button
                onClick={() => {
                  void changeEmailNotificationSetting()
                }}
                variant="contained"
              >
                メール通知設定変更
              </Button>
            </div>
          </div>
          <br />
        </>
      )}
      {!isLogined && <NeedLogin />}
      <div className="center-area">
        <GoBackButtonComponent to="/profile" label="プロフィール設定へ戻る" />
      </div>
    </div>
  )
}

export default Email
