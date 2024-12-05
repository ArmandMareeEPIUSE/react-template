import React from 'react';
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
} from '@material-tailwind/react';

const parseJwt = (token?: string | null) => {
  if (!token) {
    return {};
  }
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
};

export function NavBar() {
  const [openNav, setOpenNav] = React.useState(false);
  const [openProfileDropDown, setOpenProfileDropDown] = React.useState(false);

  const isAuthenticated = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    return !!accessToken;
  };

  React.useEffect(() => {
    window.addEventListener('resize', () => {
      return window.innerWidth >= 960 && setOpenNav(false);
    });
  }, []);

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        className="flex items-center gap-x-2 p-1 font-medium text-eu-body"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-4"
        >
          <path d="M7.702 1.368a.75.75 0 0 1 .597 0c2.098.91 4.105 1.99 6.004 3.223a.75.75 0 0 1-.194 1.348A34.27 34.27 0 0 0 8.341 8.25a.75.75 0 0 1-.682 0c-.625-.32-1.262-.62-1.909-.901v-.542a36.878 36.878 0 0 1 2.568-1.33.75.75 0 0 0-.636-1.357 38.39 38.39 0 0 0-3.06 1.605.75.75 0 0 0-.372.648v.365c-.773-.294-1.56-.56-2.359-.8a.75.75 0 0 1-.194-1.347 40.901 40.901 0 0 1 6.005-3.223ZM4.25 8.348c-.53-.212-1.067-.411-1.611-.596a40.973 40.973 0 0 0-.418 2.97.75.75 0 0 0 .474.776c.175.068.35.138.524.21a5.544 5.544 0 0 1-.58.681.75.75 0 1 0 1.06 1.06c.35-.349.655-.726.915-1.124a29.282 29.282 0 0 0-1.395-.617A5.483 5.483 0 0 0 4.25 8.5v-.152Z" />
          <path d="M7.603 13.96c-.96-.6-1.958-1.147-2.989-1.635a6.981 6.981 0 0 0 1.12-3.341c.419.192.834.393 1.244.602a2.25 2.25 0 0 0 2.045 0 32.787 32.787 0 0 1 4.338-1.834c.175.978.315 1.969.419 2.97a.75.75 0 0 1-.474.776 29.385 29.385 0 0 0-4.909 2.461.75.75 0 0 1-.794 0Z" />
        </svg>

        <a href="/dummy-data-page" className="flex items-center">
          Dummy Data Page
        </a>
      </Typography>
    </ul>
  );

  const handleOpenProfileDropDown = () => setOpenProfileDropDown((cur) => !cur);

  const parsedTokenPayload = parseJwt(sessionStorage.getItem('accessToken'));

  return (
    <Navbar className="block w-full max-w-screen-lg px-4 py-2 mx-auto bg-white bg-opacity-90 sticky top-3 shadow lg:px-8 lg:py-4 backdrop-blur-lg backdrop-saturate-150 z-[9999]">
      <div className="container mx-auto flex items-center justify-between text-eu-body">
        <div>
          <Typography
            as="a"
            href="/"
            variant="small"
            className="cursor-pointer font-medium text-eu-body"
          >
            <div className="flex items-center">
              <img
                className="object-cover object-center w-auto h-6 mr-4"
                src="./epiuse-logo-big.png"
                alt="nature image"
              />
              React Template
            </div>
          </Typography>
        </div>
        <div className="hidden lg:block">{navList}</div>
        <div className="flex items-center gap-x-1">
          {isAuthenticated() ? (
            <div className="relative">
              <button
                className="hidden lg:inline-block"
                onClick={handleOpenProfileDropDown}
              >
                <Typography
                  variant="small"
                  className="flex items-center gap-x-2 p-1 font-medium text-eu-body"
                >
                  {`${parsedTokenPayload.given_name} ${parsedTokenPayload.family_name}`}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Typography>
              </button>
              <div
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                hidden={!openProfileDropDown}
              >
                <a
                  href="signout"
                  className="block px-4 py-2 text-sm text-gray-700"
                  role="menuitem"
                >
                  Sign Out
                </a>
              </div>
            </div>
          ) : (
            <a href="/signin">
              <Button size="sm" className="hidden lg:inline-block bg-eu-red">
                Sign In
              </Button>
            </a>
          )}
        </div>
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => {
            return setOpenNav(!openNav);
          }}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <div className="container mx-auto">
          {navList}
          <div className="flex items-center gap-x-1">
            {isAuthenticated() ? (
              <a href="/signout">
                <Button size="sm" className="bg-eu-red">
                  Sign Out
                </Button>
              </a>
            ) : (
              <a href="/signin">
                <Button size="sm" className="bg-eu-red">
                  Sign In
                </Button>
              </a>
            )}
          </div>
        </div>
      </Collapse>
    </Navbar>
  );
}
