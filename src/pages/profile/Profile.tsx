import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TextareaAutosize, Button } from '@mui/material'
import { Auth } from 'aws-amplify'
import axios from 'axios'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import { handleErrorBriefly, getDisplayUsername, handleAxiosError } from '../../common/util'
import { PageProps, AuthBase } from '../../common/interface'
import { SubmitButtonComponent, GoBackButtonComponent } from '../../common/components/ButtonComponents'
import IndicatorComponent from '../../common/components/IndicatorComponent'

const Profile: React.FC<PageProps> = (props) => {
  const { isLogined } = props
  const navigate = useNavigate()
  const [profile, setProfile] = useState('')
  const [indicatorFlag, setIndicatorFlag] = useState(false)

  const getCurrentProfile = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const user = await Auth.currentAuthenticatedUser()
      const attributes = await Auth.userAttributes(user)
      attributes.map((attribute) => {
        if (attribute.getName() === 'profile') {
          setProfile(attribute.getValue())
        }
        return true
      })
    } catch (error) {
      handleErrorBriefly(error)
      setProfile('')
    }
  }

  const changeProfile = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProfile(event.target.value)
  }

  const submit = async () => {
    try {
      setIndicatorFlag(true)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const user = await Auth.currentAuthenticatedUser()
      await Auth.updateUserAttributes(user, { profile })
        .then(() => {
          alert('プロフィール変更が完了しました')
        })
        .finally(() => {
          setIndicatorFlag(false)
        })
    } catch (error) {
      handleErrorBriefly(error)
    }
  }

  useEffect(() => {
    if (isLogined) {
      void getCurrentProfile()
    } else {
      navigate('/', { replace: true })
    }
  }, [isLogined, navigate])

  const withdraw = async () => {
    const check = window.confirm('退会処理は取り消すことができません。実行してよろしいでしょうか?')
    if (check) {
      setIndicatorFlag(true)
      const url = `${process.env.REACT_APP_API_URL as string}/user/withdraw`
      await Auth.currentAuthenticatedUser()
        .then(async (user) => {
          const cognitoUser = await Auth.userSession(user)
          const accessToken = cognitoUser.getAccessToken().getJwtToken()
          const params: AuthBase = {
            access_token: accessToken,
          }
          axios
            .delete(url, { data: params })
            .then(async () => {
              await Auth.signOut()
                .then(() => {
                  alert('退会に成功しました')
                  navigate('/', { replace: true })
                })
                .catch((error) => {
                  handleErrorBriefly(error)
                })
            })
            .catch((error) => {
              handleAxiosError(error)
            })
        })
        .finally(() => {
          setIndicatorFlag(false)
        })
    }
  }

  return (
    <div>
      {indicatorFlag && <IndicatorComponent />}
      <h2>ユーザー設定</h2>
      <div className="create-area">
        <h3>プロフィール</h3>
        <TextareaAutosize value={profile} onChange={changeProfile} className="text-area" />
        <div className="right-area">
          <SubmitButtonComponent func={submit} />
        </div>
        <br />
        <Link to="/profile/email">メールアドレス/メール通知設定へ</Link>
        <br />
        <Link to="/profile/password">パスワード変更へ</Link>
        <br />
        <p className="warning-message">
          退会後の投稿済みテーマ、小論文、コメントは、ユーザー名が「{getDisplayUsername('')}
          」に変更されたまま、残り続けます
        </p>
        <div className="right-area">
          <Button
            onClick={() => {
              void withdraw()
            }}
            color="error"
          >
            <PersonOffIcon fontSize="medium" />
            退会する
          </Button>
        </div>
      </div>
      <div className="center-area">
        <GoBackButtonComponent to="/" label="トップ画面へ" />
      </div>
    </div>
  )
}

export default Profile
