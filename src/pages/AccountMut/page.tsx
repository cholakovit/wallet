import { FC } from 'react'
import { useParams } from 'react-router-dom'
import AccountMutation from '../../components/AccountMutation'
import DisplayAccountBalance from '../../components/DisplayAccountBalance'

const AccountMut: FC = () => {
  const params = useParams<{ id: string }>()

  if(!params.id) return <div>missing id</div>

  return (
    <div>
      <AccountMutation walletId={params.id} />
      <DisplayAccountBalance />
    </div>
  )
}

export default AccountMut