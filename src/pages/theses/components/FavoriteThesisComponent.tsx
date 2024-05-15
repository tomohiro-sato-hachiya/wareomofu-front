import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Auth } from 'aws-amplify'
import { FavoriteThesisBase, AuthBase } from '../../../common/interface'
import { handleAxiosError } from '../../../common/util'
import { FavoriteIconComponent } from '../../../common/components/IconComponents'

interface PROPS {
  thesisId: number
  isLogined: boolean
}

interface FavoriteThesisCrud extends FavoriteThesisBase, AuthBase {}

const FavoriteThesisComponent: React.FC<PROPS> = (props) => {
  const { thesisId, isLogined } = props
  const [isFavorite, setIsFavorite] = useState(false)
  const [isDone, setIsDone] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkIsFavorite = async () => {
    const url = `${process.env.REACT_APP_API_URL as string}/favorite/read`
    await Auth.currentAuthenticatedUser().then(async (user) => {
      const cognitoUser = await Auth.userSession(user)
      const accessToken = cognitoUser.getAccessToken().getJwtToken()
      const params: FavoriteThesisCrud = {
        access_token: accessToken,
        thesis_id: thesisId,
      }
      axios
        .post(url, params)
        .then((response) => {
          setIsFavorite(response.data as boolean)
        })
        .catch((error) => {
          console.log(error)
        })
    })
  }

  const like = async () => {
    if (isDone) {
      return
    }
    if (isLogined) {
      const url = `${process.env.REACT_APP_API_URL as string}/favorite/like`
      await Auth.currentAuthenticatedUser().then(async (user) => {
        const cognitoUser = await Auth.userSession(user)
        const accessToken = cognitoUser.getAccessToken().getJwtToken()
        const params: FavoriteThesisCrud = {
          access_token: accessToken,
          thesis_id: thesisId,
        }
        axios
          .post(url, params)
          .then(() => {
            setIsFavorite(true)
            setIsDone(true)
          })
          .catch((error) => {
            handleAxiosError(error)
          })
      })
    } else {
      alert('ログインが必要です')
    }
  }

  const dislike = async () => {
    if (isDone) {
      return
    }
    const url = `${process.env.REACT_APP_API_URL as string}/favorite/dislike`
    await Auth.currentAuthenticatedUser().then(async (user) => {
      const cognitoUser = await Auth.userSession(user)
      const accessToken = cognitoUser.getAccessToken().getJwtToken()
      const params: FavoriteThesisCrud = {
        access_token: accessToken,
        thesis_id: thesisId,
      }
      axios
        .delete(url, { data: params })
        .then(() => {
          setIsFavorite(false)
          setIsDone(true)
        })
        .catch((error) => {
          handleAxiosError(error)
        })
    })
  }

  useEffect(() => {
    if (isLogined) {
      void checkIsFavorite()
    } else {
      setIsFavorite(false)
    }
  }, [isLogined, checkIsFavorite])

  return (
    <>
      {!isFavorite && !isDone && (
        <>
          下の
          <FavoriteIconComponent isFavorite={false} />
          をクリックして
          <FavoriteIconComponent isFavorite />
          にしてください&#x1f64f;
          <br />
        </>
      )}
      {isFavorite && isDone && (
        <>
          ありがとうございます!&#x1faf6;
          <br />
        </>
      )}
      <FavoriteIconComponent isFavorite={isFavorite} func={isFavorite ? dislike : like} />
    </>
  )
}

export default FavoriteThesisComponent
