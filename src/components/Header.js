import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import {
  browserSessionPersistence,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveUser,
  setUserLogOutState,
  selectUserName,
  selectUserPhotoUrl,
  selectUserEmail,
} from "../features/userSlice";
import { auth, provider } from "../firebase";

function Header() {
  // Redux global state
  const dispatch = useDispatch();

  // Check user auth state on page render
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      // If user exists
      if (user) {
        // Push user to redux store
        dispatch(
          setActiveUser({
            userName: user.displayName,
            userEmail: user.email,
            photoUrl: user.photoURL,
          })
        );
        // If session expired
      } else {
        // Clear user data from redux store
        dispatch(setUserLogOutState());
      }
    });
  }, []);

  // Global user state data
  const user = {
    username: useSelector(selectUserName),
    email: useSelector(selectUserEmail),
    photoUrl: useSelector(selectUserPhotoUrl),
  };

  // Sign in logic
  const handleSignIn = () => {
    setPersistence(auth, browserSessionPersistence).then(() => {
      signInWithPopup(auth, provider)
        .then((result) => {
          dispatch(
            setActiveUser({
              userName: result.user.displayName,
              userEmail: result.user.email,
              photoUrl: result.user.photoURL,
            })
          );
        })
        .catch((error) => console.error(error));
    });
  };

  // Sign out logic
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(setUserLogOutState());
      })
      .catch((error) => console.log(error));
  };
  return (
    <header className="sticky top-0 z-50 flex md:items-center px-4 py-2 shadow-sm bg-white">
      <Icon name="code" size="4xl" color="blue" />
      <h1 className="md:inline-flex text-blue-400 text-2xl ml-auto mr-2">
        عرب
      </h1>

      <div>
        <img
          src={user.username ? user.photoUrl : ""}
          alt=""
          className="hidden md:inline-flex cursor-pointer h-12 w-12 rounded-full ml-2"
        />
        <Button
          color="blue"
          buttonType="fill"
          rounded={true}
          ripple="dark"
          className="md:inline-flex ml-2 cursor-pointer"
          onClick={user.username ? () => handleSignOut() : () => handleSignIn()}
        >
          {user.username ? "تسجيل الخروج" : "تسجيل الدخول"}
        </Button>
      </div>
    </header>
  );
}

export default Header;
