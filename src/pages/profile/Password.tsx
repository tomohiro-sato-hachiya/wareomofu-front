import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, TextField } from '@mui/material'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import { Auth } from 'aws-amplify'
import { handleErrorBriefly } from '../../common/util'
import { PageProps } from '../../common/interface'
import NeedLogin from '../../common/components/NeedLogin'
import { GoBackButtonComponent } from '../../common/components/ButtonComponents'
import IndicatorComponent from '../../common/components/IndicatorComponent'

const Password: React.FC<PageProps> = (props) => {
  const { isLogined } = props
  const navigate = useNavigate()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword1, setNewPassword1] = useState('')
  const [newPassword2, setNewPassword2] = useState('')
  const [indicatorFlag, setIndicatorFlag] = useState(false)

  const changeOldPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(event.target.value)
  }

  const changeNewPassword1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword1(event.target.value)
  }

  const changeNewPassword2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword2(event.target.value)
  }

  const submit = async () => {
    if (newPassword1 === newPassword2) {
      setIndicatorFlag(true)
      await Auth.currentAuthenticatedUser()
        .then(async (user) => {
          await Auth.changePassword(user, oldPassword, newPassword1)
            .then(() => {
              alert('パスワード変更が完了しました')
              navigate('/profile', { replace: true })
            })
            .catch((error) => {
              handleErrorBriefly(error)
            })
        })
        .catch((error) => {
          handleErrorBriefly(error)
        })
        .finally(() => {
          setIndicatorFlag(false)
        })
    } else {
      alert('新しいパスワードが一致しません')
    }
  }

  return (
    <div>
      {indicatorFlag && <IndicatorComponent />}
      {isLogined && (
        <>
          <h2>パスワード変更</h2>
          <div id="password-area" className="create-area">
            <TextField
              label="現在のパスワード"
              type="password"
              value={oldPassword}
              onChange={changeOldPassword}
              className="text-form"
            />
            <br />
            <TextField
              label="新しいパスワード"
              type="password"
              value={newPassword1}
              onChange={changeNewPassword1}
              className="text-form"
            />
            <br />
            <TextField
              label="確認用"
              type="password"
              value={newPassword2}
              onChange={changeNewPassword2}
              className="text-form"
            />
            <br />
            <div className="right-area">
              <Button
                onClick={() => {
                  void submit()
                }}
                variant="contained"
              >
                <ChangeCircleIcon fontSize="medium" />
                変更する
              </Button>
            </div>
          </div>
        </>
      )}
      {!isLogined && <NeedLogin />}
      <br />
      <div className="center-area">
        <GoBackButtonComponent to="/profile" label="プロフィール設定へ" />
      </div>
    </div>
  )
}

export default Password
