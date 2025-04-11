// src/pages/Logout.jsx
import { useEffect } from 'react'; // 👈 1
import { useAuth } from '../contexts/auth'; // 👈 1

export default function Logout() {
  const { isAuthed, logout } = useAuth(); // 👈 1

  // 👇 1
  useEffect(() => {
    logout();
  }, [logout]);

  // 👇 2
  if (isAuthed) {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <h1>Logging out...</h1>
          </div>
        </div>
      </div>
    );
  }

  // 👇 3
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-12'>
          <h1>You were successfully logged out</h1>
        </div>
      </div>
    </div>
  );
}
