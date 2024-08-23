import { Navigate } from 'react-router-dom';
import { store } from '../stores/store';

interface Props {
    child: JSX.Element
}

export default function ProtectRoute({child}:Props) {
    const { accountStore } = store;  

  if(!accountStore.isLoggedin)
    return <Navigate to='/' replace={true} />

  return child;
}
