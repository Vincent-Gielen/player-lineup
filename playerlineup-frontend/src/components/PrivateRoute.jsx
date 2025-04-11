import { Navigate, Outlet, useLocation } from 'react-router-dom'; // 👈 3 en 4
import { useAuth } from '../contexts/auth'; // 👈 2

// 👇 1
export default function PrivateRoute() {
  const { ready, isAuthed } = useAuth(); // 👈 2
  const { pathname } = useLocation(); // 👈 4

  // 👇 2
  if (!ready) {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <h1>Loading...</h1>
            <p>
              Please wait while we are checking your credentials and loading the
              application.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 👇 3
  if (isAuthed) {
    return <Outlet />;
  }

  return <Navigate replace to={`/login?redirect=${pathname}`} />; // 👈 4
}
