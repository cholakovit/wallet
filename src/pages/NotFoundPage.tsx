import { FC } from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage: FC = () => {
  return (
    <div>
      404 Not Found

      <Link to={'/'}>Home from Link</Link>
    </div>
  )
}

export default NotFoundPage