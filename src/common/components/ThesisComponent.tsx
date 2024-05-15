import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ThesisSummary, ThemeSummary } from '../interface'
import { UserButtonComponent } from './ButtonComponents'
import { FavoriteIconComponent } from './IconComponents'
import { getSummary, getDispDatetime } from '../util'

interface PROPS extends ThesisSummary {
  themes: ThemeSummary[] | null
}

const ThesisComponent: React.FC<PROPS> = (props) => {
  const { id, username, theme_id, content, favorites, themes, created_at } = props

  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')

  useEffect(() => {
    setSummary(getSummary(content))
  }, [content])

  useEffect(() => {
    if (themes) {
      themes.forEach((theme) => {
        if (theme.id === theme_id) {
          setTitle(theme.title)
        }
      })
    }
  }, [theme_id, themes])

  return (
    <div>
      <Link to={`/theses/${id}`}>
        <h4>{summary}</h4>
      </Link>
      <UserButtonComponent username={username} />
      <br />
      テーマ: <Link to={`/themes/${theme_id}`}>{title}</Link>
      <br />
      <FavoriteIconComponent isFavorite /> &times; {favorites.length}
      <br />
      投稿日時: {getDispDatetime(created_at)}
    </div>
  )
}

export default ThesisComponent
