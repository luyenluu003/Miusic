import axios from "axios"
import { useContext, useState } from "react"
import { UserContext } from "../App"
import { filterPaginationData } from "../common/filter-pagination-data"
import { useEffect } from "react"
import Loader from "../components/loader.component"
import AnimationWrapper from "../common/page-animation"
import NotificationCard from "../components/notification-card.components"
import LoadMoreDataBtn from "../components/loadmoreData.components"

const Notifications = () => {

    let {userAuth: {access_token}} = useContext(UserContext)

    const [filter ,setFilter] = useState("all")
    let [notifications,setNotifications] = useState(null)

    let filters= ['all','like','comment','reply']

    const fetchNotificatios  = ({page,deletedDocCount =0})=>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/notifications",{page,filter,deletedDocCount},{
            headers:{
                'Authorization':`Bearer ${access_token}`
            }
        })
        .then(async({data:{notifications:data}})=>{
            let formatedData =  await filterPaginationData({
                state:notifications,
                data,page,
                countRoute:"/all-notifications-count",
                data_to_send:{filter},
                user:access_token
            })

            setNotifications(formatedData)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        if(access_token){
            fetchNotificatios({page:1})
        }

    },[access_token,filter])

    const handleFilter = (e) => {
        let btn = e.target;
        setFilter(btn.innerHTML);
        setNotifications(null)

    }

    return (
        <div>
            <h1 className="max-md:hidden text-blue-gwen">Recent Notifications</h1>

            <div className="my-8 flex gap-3">
                {
                    filters.map((filterName ,i)=>{
                        return <button className={" py-2 "+(filter== filterName ? 'btn-blue-gwen text-white':"btn-light text-black")} onClick={handleFilter} key={i}>{filterName}</button>
                    })
                }
            </div>
            {
                notifications == null ? <Loader /> : 
                <>
                    {
                        notifications.results.length ? 
                            notifications.results.map((notification,i)=>{
                                return <AnimationWrapper key={i} transition={{delay:i*0.08}}>
                                            <NotificationCard data={notification} index={i} notificationState={{notifications,setNotifications}} />
                                        </AnimationWrapper>
                            })
                            : <p className="text-blue-gwen">No Notifications</p>
                    }

                    <LoadMoreDataBtn state={notifications} fetchDataFun={fetchNotificatios} additionalParam={{deletedDocCount:notifications.deletedDocCount}} />
                </>
            }
        </div>
    )
}

export default Notifications