import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { logout } from "@/store/reducers/userSlice";
import { useRouter } from "next/navigation";

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  const token = useSelector((state: RootState) => state.user.token);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return {
    user,
    token,
    isAuthenticated,
    logout: handleLogout,
  };
}
