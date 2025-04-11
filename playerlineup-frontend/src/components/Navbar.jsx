// src/components/Navbar.jsx
import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../contexts/theme';
import { IoMoonSharp, IoSunny } from 'react-icons/io5';
import { useAuth } from '../contexts/auth';

export default function Navbar() {
  const { isAuthed, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={`navbar sticky-top bg-${theme} text-bg-${theme}  mb-4`}>
      <div className='container-fluid flex-column flex-sm-row align-items-start align-items-sm-center'>
        <div className='nav-item my-2 mx-sm-3 my-sm-0'>
          <NavLink className='nav-link' to='/'>
            Home
          </NavLink>
        </div>
        <div className='nav-item my-2 mx-sm-3 my-sm-0'>
          <NavLink className='nav-link' to={`/users/${user?.id}`}>
            Account
          </NavLink>
        </div>
        <div className='nav-item my-2 mx-sm-3 my-sm-0'>
          <NavLink className='nav-link' to='/players'>
            View all players
          </NavLink>
        </div>
        <div className='nav-item my-2 mx-sm-3 my-sm-0'>
          
          <NavLink className='nav-link' to='/teams'>
            View my teams
          </NavLink>
        </div>
        <div className='nav-item my-2 mx-sm-3 my-sm-0'>
          { user?.id === 1 && (// is dit wel juist
            <NavLink className='nav-link' to='/users'>
              View users
            </NavLink>
          )}

        </div>
        <div className='flex-grow-1'></div>

        {isAuthed ? (
          <div className='nav-item my-2 mx-sm-3 my-sm-0'>
            <Link className='nav-link' to='/logout' data-cy='logout_btn'>
              Logout
            </Link>
          </div>
        ) : (
          <>
            <div className='nav-item my-2 mx-sm-3 my-sm-0'>
              <Link className='nav-link' to='/login'>
                Login
              </Link>
            </div>
            <div className="nav-item my-2 mx-sm-3 my-sm-0">
              <Link className="nav-link" to="/register" data-cy='logout_btn'>Register</Link>
            </div>
          </>
        )
        }

        <button
          className='btn btn-secondary'
          type='button'
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <IoMoonSharp /> : <IoSunny />}
        </button>
      </div>
    </nav>
  );
}
