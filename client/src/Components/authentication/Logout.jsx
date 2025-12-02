import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/context";

export const Layout = () => {
    const { logout } = useAuth();
    return (
        <div>
            <nav 
            onClick={logout}>
                Logout
            </nav>
            <main>
                <Outlet />
            </main>
        </div>
    )
}