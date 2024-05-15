import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Stack, Divider } from '@mui/material'
import { CommentDetail } from '../../../../common/interface'
import Loading from '../../../../common/components/Loading'
import { handleAxiosError } from '../../../../common/util'
import Pages from '../../../../common/components/Pages'
import CommentComponent from './components/CommentComponent'

interface PROPS {
  thesisId: number
  currentUsername: string
  isLogined: boolean
}

const CommentsComponent: React.FC<PROPS> = (props) => {
  const { thesisId, currentUsername, isLogined } = props
  const [page, setPage] = useState(1)
  const [comments, setComments] = useState<CommentDetail[] | null>(null)

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_URL as string}/comments/${thesisId}/${page}`
    axios
      .get(url)
      .then((response) => {
        setComments(response.data as CommentDetail[])
      })
      .catch((error) => {
        handleAxiosError(error)
      })
  }, [thesisId, page])

  return (
    <>
      <Pages
        url={`${process.env.REACT_APP_API_URL as string}/pages/comments/${thesisId}`}
        page={page}
        setPage={setPage}
      />
      {comments === null && <Loading />}
      {comments !== null && (
        <div className="left-area">
          <Stack direction="column" divider={<Divider orientation="horizontal" flexItem />}>
            {comments.map((comment) => (
              <CommentComponent
                id={comment.id}
                thesis_id={thesisId}
                username={comment.username}
                content={comment.content}
                currentUsername={currentUsername}
                isLogined={isLogined}
                created_at={comment.created_at}
              />
            ))}
          </Stack>
        </div>
      )}
    </>
  )
}

export default CommentsComponent
