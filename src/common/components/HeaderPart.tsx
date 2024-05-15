import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button, Stack } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import { Authenticator, useAuthenticator, CheckboxField } from '@aws-amplify/ui-react'
import { UserButtonComponent } from './ButtonComponents'

const HeaderPart: React.FC = () => {
  const navigate = useNavigate()

  const goToProfile = () => {
    navigate('/profile', { replace: true })
  }

  return (
    <div>
      <div id="logo" className="center-area base-style">
        <Link to="/">
          <img src="/logo.png" alt="我思フ - 小論文投稿プラットフォーム" />
        </Link>
      </div>
      <br />
      <div className="right-area">
        <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_MANUAL_URL as string}`}>
          ご利用マニュアル
        </a>
      </div>
      <br />
      <Authenticator
        components={{
          SignUp: {
            // eslint-disable-next-line react/no-unstable-nested-components
            FormFields: () => {
              const { validationErrors } = useAuthenticator()
              return (
                <>
                  <Authenticator.SignUp.FormFields />
                  <CheckboxField
                    errorMessage={validationErrors.acknowledgement as string}
                    hasError={!!validationErrors.acknowledgement}
                    name="acknowledgement"
                    value="yes"
                    label={
                      <span>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`${
                            process.env.REACT_APP_PUBLIC_FILES_URL as string
                          }/documents/terms_and_conditions.pdf`}
                        >
                          利用規約
                        </a>
                        と
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`${process.env.REACT_APP_PUBLIC_FILES_URL as string}/documents/privacy_policy.pdf`}
                        >
                          プライバシーポリシー
                        </a>
                        に同意します
                      </span>
                    }
                  />
                </>
              )
            },
          },
        }}
        services={{
          // eslint-disable-next-line @typescript-eslint/require-await
          validateCustomSignUp: async (formData: any, touchData: any) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (!formData.acknowledgement) {
              return {
                acknowledgement: '利用規約とプライバシーポリシーへの同意が必要です',
              }
            }
            return null
          },
        }}
      >
        {({ signOut, user }) => (
          <div id="hello" className="right-area base-style">
            <span>
              こんにちは、{user && user.username ? <UserButtonComponent username={user.username} /> : <>guest</>}
              さん&#x1f44b;
            </span>
            <div className="link-button-area">
              <Button variant="outlined" size="medium" color="primary" onClick={goToProfile}>
                <AccountCircleIcon fontSize="medium" />
                ユーザー設定/退会
              </Button>
            </div>
            <div className="link-button-area">
              <Button variant="outlined" size="medium" color="error" onClick={signOut}>
                <LogoutIcon fontSize="medium" />
                ログアウト
              </Button>
            </div>
          </div>
        )}
      </Authenticator>
      <br />
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-evenly" className="menus base-style">
        <div className="link-button-area">
          <Link to="/">
            <Button variant="outlined">小論文</Button>
          </Link>
        </div>
        <div className="link-button-area">
          <Link to="/themes">
            <Button variant="outlined">テーマ</Button>
          </Link>
        </div>
        <div className="link-button-area">
          <Link to="/favorites">
            <Button variant="outlined">お気に入り</Button>
          </Link>
        </div>
      </Stack>
    </div>
  )
}

export default HeaderPart
