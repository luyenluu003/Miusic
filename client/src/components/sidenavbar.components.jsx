import { useContext } from "react"
import {Outlet,Navigate} from "react-router-dom"
import { UserContext } from "../App"

const SideNav = () => {

    let {userAuth:{access_token} } = useContext(UserContext)
    return (

        access_token === null ? <Navigate to="/signin" />:
        <>
        

            <Outlet />
        </>
    )
}

export default SideNav