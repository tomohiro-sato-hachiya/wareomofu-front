import React, { useState } from 'react'
import axios from 'axios'
import { TextareaAutosize } from '@mui/material'
import { Auth } from 'aws-amplify'
import { CommentBase, AuthBase } from '../../../../common/interface'
import { handleAxiosError, handleErrorBriefly, confirmBeforePost } from '../../../../common/util'
import { SubmitButtonComponent } from '../../../../common/components/ButtonComponents'
import IndicatorComponent from '../../../../common/components/IndicatorComponent'

interface PROPS {
  thesisId: number
  isLogined: boolean
}

interface CommentCreate extends CommentBase, AuthBase {}

const CreateCommentComponent: React.FC<PROPS> = (props) => {
  const { thesisId, isLogined } = props
  const [content, setContent] = useState('')
  const [indicatorFlag, setIndicatorFlag] = useState(false)

  const changeContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value)
  }

  const create = async () => {
    if (confirmBeforePost()) {
      setIndicatorFlag(true)
    } else {
      return
    }
    await Auth.currentAuthenticatedUser()
      .then(async (user) => {
        const cognitoUser = await Auth.userSession(user)
        const accessToken = cognitoUser.getAccessToken().getJwtToken()
        const params: CommentCreate = {
          thesis_id: thesisId,
          content,
          access_token: accessToken,
        }
        const url = `${process.env.REACT_APP_API_URL as string}/comment/create`
        axios
          .post(url, params)
          .then(() => {
            alert('投稿に成功しました')
            setContent('')
          })
          .catch((error) => {
            handleAxiosError(error)
          })
      })
      .catch((error) => {
        handleErrorBriefly(error)
      })
      .finally(() => {
        setIndicatorFlag(false)
      })
  }

  return (
    <p>
      {indicatorFlag && <IndicatorComponent />}
      {!isLogined && 'コメントを投稿するにはログインが必要です'}
      {isLogined && (
        <div className="create-area">
          <TextareaAutosize value={content} placeholder="コメント内容" onChange={changeContent} className="text-area" />
          <br />
          <div className="right-area">
            <SubmitButtonComponent func={create} />
          </div>
        </div>
      )}
    </p>
  )
}

export default CreateCommentComponent
