import axios from 'axios'
import { ThemeBase, ThesisSummary } from './interface'

interface AxiosErrorMsg {
  msg: string
}

interface AxiosErrorResponseData {
  detail: string | AxiosErrorMsg[]
}

export const handleErrorBriefly = (error: any): void => {
  console.log(error)
  alert('エラーが発生しました')
}

export const handleAxiosError = (error: any): void => {
  console.log(error)
  if (axios.isAxiosError(error) && error.response && error.response.data) {
    const { response } = error
    const { data } = response
    const { detail } = data as AxiosErrorResponseData
    let message = 'エラーが発生しました'
    if (detail instanceof Array) {
      // eslint-disable-next-line no-restricted-syntax
      for (const iterator of detail) {
        message = `${message}\n${iterator.msg}`
      }
    } else {
      message = `${message}\n${detail}`
    }
    alert(message)
  } else if (error instanceof Error) {
    alert(error.message)
  } else {
    alert('予期せぬエラーが発生しました')
  }
}

export const getPeriod = (theme?: ThemeBase | null) => {
  let period = '指定なし'
  let canPost = true
  const now = new Date()
  if (theme && (theme.start_datetime !== null || theme.expire_datetime !== null)) {
    let startDatetimeStr = ''
    if (theme.start_datetime !== null) {
      const startDatetime = new Date(theme.start_datetime)
      startDatetimeStr = startDatetime.toLocaleString()
      if (now < startDatetime) {
        canPost = false
      }
    }
    let expireDatetimeStr = ''
    if (theme.expire_datetime !== null) {
      const expireDatetime = new Date(theme.expire_datetime)
      expireDatetimeStr = expireDatetime.toLocaleString()
      if (expireDatetime < now) {
        canPost = false
      }
    }
    period = `${startDatetimeStr} ~ ${expireDatetimeStr}`
  }
  return {
    str: period,
    canPost,
  }
}

export const getDisplayUsername = (username: string | null): string => username || '退会済みユーザー'

export const getThemeIdsUrl = (theses: ThesisSummary[]): string => {
  const themeIdsSet = new Set(theses.map((thesis) => thesis.theme_id))
  const themeIds = Array.from(themeIdsSet)
  let url = `${process.env.REACT_APP_API_URL as string}/themes/1?`
  const queries = themeIds.map((themeId) => `theme_ids=${themeId}`)
  url += queries.join('&')
  return url
}

export const convertFreeWordsForSearch = (freeWords: string): string => {
  const wordsList = freeWords
    .split('　')
    .join(' ')
    .replace(/\s/, ' ')
    .split(' ')
    .map((freeWord) => (freeWord ? `&free_words=${encodeURIComponent(freeWord)}` : ''))
  if (wordsList) {
    const joined = wordsList.join('')
    if (joined) {
      return joined
    }
  }
  return ''
}

export const convertFlagToBinary = (flag: boolean): 0 | 1 => (flag ? 1 : 0)

export const getSummary = (content: string, size = 10): string =>
  content.length <= size ? content : `${content.substring(0, 7)}...`

export const confirmBeforePost = (): boolean =>
  window.confirm('投稿後、更新や削除ができません。\nご入力いただだいた内容で、投稿を行なってもよろしいでしょうか?')

export const confirmBeforeReport = (): boolean =>
  window.confirm('ご入力いただだいた内容で、通報を行なってもよろしいでしょうか?')

export const getDispDatetime = (datetime: string): string => new Date(datetime).toLocaleString('ja-JP')
