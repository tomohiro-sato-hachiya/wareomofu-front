import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, Stack, Divider } from '@mui/material'
import { useParams } from 'react-router-dom'
import Pages from '../../common/components/Pages'
import { PageProps, ThemeSummary, ThesisSummary } from '../../common/interface'
import { ContentTypes } from '../../common/enum'
import ThemeComponent from '../../common/components/ThemeComponent'
import ThesisComponent from '../../common/components/ThesisComponent'
import { handleAxiosError, getThemeIdsUrl } from '../../common/util'
import UserReportComponent from './components/UserReportComponent'
import { ReportButtonComponent } from '../../common/components/ButtonComponents'
import ReportDialogComponent from '../../common/components/ReportDialogComponent'

const User: React.FC<PageProps> = (props) => {
  const { isLogined, currentUsername } = props
  const { username } = useParams()
  const [profile, setProfile] = useState('')
  const [page, setPage] = useState(1)
  const [themes, setThemes] = useState<ThemeSummary[] | null>(null)
  const [theses, setTheses] = useState<ThesisSummary[] | null>(null)
  const [themesOfTheses, setThemesOfTheses] = useState<ThemeSummary[] | null>(null)
  const [themesOfFavorites, setThemesOfFavorites] = useState<ThemeSummary[] | null>(null)
  const [favorites, setFavorites] = useState<ThesisSummary[] | null>(null)
  const [contentType, setContentType] = useState(ContentTypes.Thesis)
  const [pageUrl, setPageUrl] = useState('')
  const [isReporting, setIsReporting] = useState(false)

  const getContentTypename = (type: ContentTypes): string => {
    switch (type) {
      case ContentTypes.Theme:
        return 'themes'
      case ContentTypes.Thesis:
        return 'theses'
      case ContentTypes.Favorite:
        return 'favorites'
      default:
        return ''
    }
  }

  const getVariant = (type: ContentTypes, selectedType: ContentTypes): 'contained' | 'outlined' =>
    type === selectedType ? 'contained' : 'outlined'

  useEffect(() => {
    const contentTypeName = getContentTypename(contentType)
    if (username && contentTypeName) {
      const url = `${process.env.REACT_APP_API_URL as string}/pages/${contentTypeName}?username=${encodeURIComponent(
        username
      )}`
      setPageUrl(url)
    }
  }, [username, contentType])

  useEffect(() => {
    if (username) {
      const url = `${process.env.REACT_APP_API_URL as string}/users/${encodeURIComponent(username)}`
      axios
        .get(url)
        .then((response) => {
          setProfile(response.data as string)
        })
        .catch((error) => {
          handleAxiosError(error)
        })
    }
  }, [username])

  useEffect(() => {
    const contentTypeName = getContentTypename(contentType)
    if (username && contentTypeName) {
      const url = `${process.env.REACT_APP_API_URL as string}/${contentTypeName}/${page}?username=${username}`
      axios
        .get(url)
        .then((response) => {
          switch (contentType) {
            case ContentTypes.Theme:
              setThemes(response.data as ThemeSummary[])
              setTheses(null)
              setFavorites(null)
              break
            case ContentTypes.Thesis:
              setTheses(response.data as ThesisSummary[])
              setThemes(null)
              setFavorites(null)
              break
            case ContentTypes.Favorite:
              setFavorites(response.data as ThesisSummary[])
              setThemes(null)
              setThemes(null)
              break
            default:
              break
          }
        })
        .catch((error) => {
          handleAxiosError(error)
        })
    }
  }, [page, contentType, username])

  useEffect(() => {
    if (theses) {
      const url = getThemeIdsUrl(theses)
      axios
        .get(url)
        .then((response) => {
          setThemesOfTheses(response.data as ThemeSummary[])
        })
        .catch((error) => {
          handleAxiosError(error)
        })
    }
  }, [theses])

  useEffect(() => {
    if (favorites) {
      const url = getThemeIdsUrl(favorites)
      axios
        .get(url)
        .then((response) => {
          setThemesOfFavorites(response.data as ThemeSummary[])
        })
        .catch((error) => {
          handleAxiosError(error)
        })
    }
  }, [favorites])

  const changeContentType = (type: ContentTypes): void => {
    setPage(1)
    setContentType(type)
  }

  const startReporting = () => {
    setIsReporting(true)
  }

  return (
    <div>
      {isLogined && (
        <>
          {!isReporting && username !== currentUsername && (
            <ReportButtonComponent func={startReporting} label="このユーザーを通報する" />
          )}
          {isReporting && username && (
            <ReportDialogComponent
              isReporting={isReporting}
              setIsReporting={setIsReporting}
              // eslint-disable-next-line react/no-children-prop
              children={<UserReportComponent targetUsername={username} setIsReporting={setIsReporting} />}
              contentName="ユーザー"
            />
          )}
          <br />
        </>
      )}
      <h2>{username}さんのプロフィール</h2>
      <div className="multi-line">{profile}</div>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-evenly" className="menus">
        <Button
          variant={getVariant(ContentTypes.Thesis, contentType)}
          onClick={() => {
            changeContentType(ContentTypes.Thesis)
          }}
        >
          小論文
        </Button>
        <Button
          variant={getVariant(ContentTypes.Theme, contentType)}
          onClick={() => {
            changeContentType(ContentTypes.Theme)
          }}
        >
          テーマ
        </Button>
        <Button
          variant={getVariant(ContentTypes.Favorite, contentType)}
          onClick={() => {
            changeContentType(ContentTypes.Favorite)
          }}
        >
          お気に入り
        </Button>
      </Stack>
      {contentType === ContentTypes.Theme && themes !== null && (
        <>
          <Pages url={pageUrl} page={page} setPage={setPage} />
          <Stack direction="column" divider={<Divider orientation="horizontal" flexItem />}>
            {themes.map((theme) => (
              <ThemeComponent
                key={theme.id}
                id={theme.id}
                title={theme.title}
                username={theme.username}
                start_datetime={theme.start_datetime}
                expire_datetime={theme.expire_datetime}
                theses={theme.theses}
                created_at={theme.created_at}
              />
            ))}
          </Stack>
        </>
      )}
      {contentType === ContentTypes.Thesis && theses !== null && (
        <>
          <Pages url={pageUrl} page={page} setPage={setPage} />
          <Stack direction="column" divider={<Divider orientation="horizontal" flexItem />}>
            {theses.map((thesis) => (
              <ThesisComponent
                key={thesis.id}
                id={thesis.id}
                username={thesis.username}
                theme_id={thesis.theme_id}
                content={thesis.content}
                favorites={thesis.favorites}
                themes={themesOfTheses}
                created_at={thesis.created_at}
              />
            ))}
          </Stack>
        </>
      )}
      {contentType === ContentTypes.Favorite && favorites !== null && (
        <>
          <Pages url={pageUrl} page={page} setPage={setPage} />
          <Stack direction="column" divider={<Divider orientation="horizontal" flexItem />}>
            {favorites.map((thesis) => (
              <ThesisComponent
                key={thesis.id}
                id={thesis.id}
                username={thesis.username}
                theme_id={thesis.theme_id}
                content={thesis.content}
                favorites={thesis.favorites}
                themes={themesOfFavorites}
                created_at={thesis.created_at}
              />
            ))}
          </Stack>
        </>
      )}
    </div>
  )
}

export default User
