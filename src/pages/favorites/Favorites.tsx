import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Stack, Divider } from '@mui/material'
import Pages from '../../common/components/Pages'
import { PageProps, ThesisSummary, ThemeSummary } from '../../common/interface'
import ThesisComponent from '../../common/components/ThesisComponent'
import { handleAxiosError, getThemeIdsUrl } from '../../common/util'
import NeedLogin from '../../common/components/NeedLogin'

const Favorites: React.FC<PageProps> = (props) => {
  const { isLogined, currentUsername } = props
  const [page, setPage] = useState(1)
  const [favorites, setFavorites] = useState<ThesisSummary[] | null>(null)
  const [themes, setThemes] = useState<ThemeSummary[] | null>(null)

  useEffect(() => {
    if (isLogined && currentUsername) {
      const url = `${process.env.REACT_APP_API_URL as string}/favorites/${page}?username=${encodeURIComponent(
        currentUsername
      )}`
      axios
        .get(url)
        .then((response) => {
          setFavorites(response.data as ThesisSummary[])
        })
        .catch((error) => {
          handleAxiosError(error)
        })
    }
  }, [page, isLogined, currentUsername])

  useEffect(() => {
    if (favorites) {
      const url = getThemeIdsUrl(favorites)
      axios
        .get(url)
        .then((response) => {
          setThemes(response.data as ThemeSummary[])
        })
        .catch((error) => {
          handleAxiosError(error)
        })
    }
  }, [favorites])

  return (
    <div>
      <div className="center-area">
        <h2>お気に入り一覧</h2>
      </div>
      {isLogined && currentUsername && (
        <>
          <Pages
            url={`${process.env.REACT_APP_API_URL as string}/pages/favorites?username=${encodeURIComponent(
              currentUsername
            )}`}
            page={page}
            setPage={setPage}
          />
          {favorites !== null && (
            <Stack direction="column" divider={<Divider orientation="horizontal" flexItem />}>
              {favorites.map((thesis) => (
                <ThesisComponent
                  key={thesis.id}
                  id={thesis.id}
                  username={thesis.username}
                  theme_id={thesis.theme_id}
                  content={thesis.content}
                  favorites={thesis.favorites}
                  themes={themes}
                  created_at={thesis.created_at}
                />
              ))}
            </Stack>
          )}
        </>
      )}
      {(!isLogined || !currentUsername) && <NeedLogin />}
    </div>
  )
}

export default Favorites
