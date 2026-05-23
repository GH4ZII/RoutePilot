import { useState } from 'react'
import { userAvatarColor, userInitials } from '../lib/user-display'

type UserAvatarProps = {
  name: string | null
  email: string
  avatarUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASS = {
  sm: 'user-avatar--sm',
  md: 'user-avatar--md',
  lg: 'user-avatar--lg',
} as const

export default function UserAvatar({
  name,
  email,
  avatarUrl,
  size = 'md',
  className = '',
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false)
  const initials = userInitials(name, email)
  const color = userAvatarColor(email)
  const classes = ['user-avatar', SIZE_CLASS[size], className].filter(Boolean).join(' ')

  if (avatarUrl && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className={classes}
        loading="lazy"
        onError={() => setImgError(true)}
      />
    )
  }

  return (
    <span
      className={classes}
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {initials}
    </span>
  )
}
