import React from 'react'
import { User } from '../Pages/Home'
import { FaUserCircle } from 'react-icons/fa'

interface Props {
  user: User
}

const UserThumbnail = ({ user }: Props) => {
  return (
    <div>
      <FaUserCircle size='16px' color='blue' />
      <div>{user.name}</div>
    </div>
  )
}
export default UserThumbnail
