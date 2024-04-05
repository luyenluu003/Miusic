import { Link } from "react-router-dom";
import { getFullDay } from "../common/date";

const AboutUser = ({bio ,social_links,joinedAt}) =>{
    return(
        <div className="md:w-[90%] md:ml-14">
            <p className="text-white mt-3 leading-7 text-center md:text-start md:mt-1">{bio.length ? bio :"Nothing to read here"}</p>

            <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
                {
                    Object.keys(social_links).map((key) =>{
                        let link = social_links[key];
                        return link? <Link to={link} key={key} target="_blank"><i className={"fi " + (key != 'website' ? "fi-brands-" + key :  "fi-rr-globe")+" text-2xl text-white hover:text-blue-gwen"}></i></Link> : " "
                    })
                }
            </div>
            <p className="text-xl text-center md:text-start text-white opacity-90 leading-7">{getFullDay(joinedAt)}</p>

        </div>
    )
}

export default AboutUser