import React from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'

interface FavoriteProps {
  isFavorite: boolean
}

type onClick = () => void | Promise<void>

interface FavoriteProps {
  isFavorite: boolean
  // eslint-disable-next-line react/require-default-props
  func?: onClick
}

export const FavoriteIconComponent: React.FC<FavoriteProps> = (props) => {
  const { isFavorite, func } = props
  const sx = { color: 'red' }
  const onClick = func
    ? () => {
        void func()
      }
    : () => {
        console.log("Can't be clicked.")
      }
  const className = func ? 'cursor-pointer' : ''
  return isFavorite ? (
    <FavoriteIcon sx={sx} onClick={onClick} className={className} />
  ) : (
    <FavoriteBorderOutlinedIcon sx={sx} onClick={onClick} className={className} />
  )
}
