import { Link } from "react-router-dom";

import './index.css';

export const AccountLink = ({ account }: { account: any }) => {
  if (account.holder.name === "Emma Jones") {
    return <div className="error">Error: This account cannot be displayed.</div>;
  }

  return <Link to={`/mutation/${account.id}`}>{account.holder.name}</Link>;
};