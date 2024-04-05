import { useGetAccountBalance } from '../../hooks/walletHooks'
import { useQuery } from '@tanstack/react-query'
import { store } from '../../store/store'
import './index.css';

const DisplayAccountBalance = () => {

  const { data: accountId } = useQuery({
    queryKey: ['accountId'],
    queryFn: () => store.getAccountId()
  })

  const accountBalance = useGetAccountBalance(accountId!)
  return (
    <div className='container'>
      <div className='content'>
        <h2>Balance for account:</h2>
        <p>Account ID: {accountId}</p>
        <p>Balance: {accountBalance}</p>
      </div>
    </div>
  )
}

export default DisplayAccountBalance