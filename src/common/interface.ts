export interface PageProps {
  isLogined: boolean
  currentUsername?: string
}

export interface ReportingComponentPropsBase {
  setIsReporting: React.Dispatch<React.SetStateAction<boolean>>
}

export interface AuthBase {
  access_token: string
}

export interface ThemeDefaultConstant {
  title_max_length: number
  description_max_length: number
}

export interface ThemeBase {
  title: string
  start_datetime: string | null
  expire_datetime: string | null
}

interface ThemeWithTheses extends ThemeBase {
  theses: ThesisDetailIncludingSuspended[]
  created_at: string
}

export interface ThemeSummary extends ThemeWithTheses {
  id: number
  username: string
}

export interface ThemeDetail extends ThemeWithTheses {
  id: number
  username: string | null
  description: string
  min_length: number
  max_length: number
}

export interface ThesisDefaultConstant {
  content_max_length: number
  works_cited_max_length: number
}

export interface ThesisBase {
  theme_id: number
  content: string
}

export interface ThesisSummary extends ThesisBase {
  id: number
  username: string | null
  favorites: FavoriteThesis[]
  created_at: string
}

export interface ThesisDetail extends ThesisBase {
  id: number
  username: string | null
  works_cited: string
  favorites: FavoriteThesis[]
  created_at: string
}

interface ThesisDetailIncludingSuspended extends ThesisDetail {
  is_suspended: boolean
}

export interface ReportBase extends AuthBase {
  report_reason_id: number
  detail: string
}

export interface FavoriteThesisBase {
  thesis_id: number
}

interface FavoriteThesis extends FavoriteThesisBase {
  username: string
}

export interface CommentBase {
  thesis_id: number
  content: string
}

export interface CommentDetail extends CommentBase {
  id: number
  username: string | null
  created_at: string
}
