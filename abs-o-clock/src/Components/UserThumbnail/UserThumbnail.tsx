import React from 'react'
import { User } from '../../Pages/Home'
import { FaUserCircle } from 'react-icons/fa'
import './UserThumbnail.css'

interface Props {
  user: User
}

const UserThumbnail = ({ user }: Props) => {
  return (
    <div className='thumbnailWrapper'>
      <FaUserCircle color='gray' size='24px' />
      <div className='thumbnail'>{user.name}</div>
    </div>
  )
}
export default UserThumbnail
