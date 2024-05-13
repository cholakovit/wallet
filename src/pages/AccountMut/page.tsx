import { FC } from 'react'
import { useParams } from 'react-router-dom'
import AccountMutation from '../../components/AccountMutation'
import DisplayAccountBalance from '../../components/DisplayAccountBalance'
import ErrorBoundary from '../../helper/ErrorBoundary'

const AccountMut: FC = () => {
  const params = useParams<{ id: string }>()

  if(!params.id) return <div>missing id</div>

  return (
    <div>
      <ErrorBoundary>
        <AccountMutation walletId={params.id} />
          <DisplayAccountBalance />
      </ErrorBoundary>
    </div>
  )
}

export default AccountMut