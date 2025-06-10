import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { RootState } from '../../store';
import { privateLinks, publicLinks } from './navLinks';
import { useGetStory } from '../../hooks/useFetchArticles';

const Header: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.userAuth);
  const { data: newUserData } = useGetStory(`/user/current-user`);
  const userName = newUserData?.user?.username;
  if (userName) {
    privateLinks.splice(3, 1, {
      to: `/${userName}`,
      name: `${userName}`,
    });
  }
  const navLinks = token ? privateLinks : publicLinks;

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          WYS <span style={{ fontSize: '.9rem' }}>write your story</span>
        </NavLink>
        <ul className="nav navbar-nav pull-xs-right">
          {navLinks.map(({ to, name, icon }) => (
            <li className="nav-item" key={name}>
              {to === '/username' ? (
                <span className="nav-link">{name}</span>
              ) : (
                <NavLink className="nav-link" to={to}>
                  {icon && (
                    <>
                      <i className={icon}></i>{' '}
                    </>
                  )}
                  {name === userName && newUserData?.user?.image && (
                    <>
                      <img
                        src={newUserData?.user?.image}
                        style={{ height: '26px', borderRadius: '50px' }}
                      />{' '}
                    </>
                  )}
                  {name}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
