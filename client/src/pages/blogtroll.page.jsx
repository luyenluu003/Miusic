import naruto from "../imgs/naruto1.png";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
const Blogtroll = () => {
    const navgate = useNavigate();
    return (
        <section className="h-cover relative p-10 flex flex-col bg-gray">
            <div className="min-w-screen  bg-blue-100 flex items-center p-5 overflow-hidden relative">
               <p className="text-white font-black">
                    <h1 className="text-white font-black text-3xl">Terms of Use</h1>
                    <br />
                    <br />
                    1. ACKNOWLEDGE AND AGREE TO THE TERMS OF USE OF THE SERVICE
                    This website (“website”) is provided subject to these Terms of Use and any Regulations, Policies and Procedures that may be hereafter promulgated in connection with the use of the website. Users who access information from the website are referred to below as "Users". By using this website, you agree to these Terms of Use and have the same effect as the signed Agreement.
                    <br />
                    <br />
                    2. INFORMATION ABOUT THE COMPANY
                    The website is designed to provide the financial investment community with general information about the field of fund management activities of Manulife Vietnam Fund Management Company Limited ("Manulife IM (VN)"). The products and services mentioned on this website are provided by Manulife IM (VN), headquartered at Manulife Plaza Building, 7th Floor, 75 Hoang Van Thai, District 7, City. Ho Chi Minh, Vietnam.
                    <br />
                    <br />
                    3. IMPORTANT NOTES
                    No information posted on this website constitutes investment, insurance, securities, tax or legal advice. The website does not provide any advice regarding stock prices, investment recommendations, buying or selling securities or insurance products. Decisions made based on the information provided at this website are the sole responsibility of the User. The information on this website is not intended to be an offer or solicitation to buy any securities, participate in investments or purchase insurance or services.
                    <br />
                    <br />
                    4. WEBSITE LINK
                    The Website may provide connections to third party websites or network resources. The user acknowledges and agrees that Manulife IM (VN) is not responsible for whether such connection is successful or not and does not guarantee, approve, investigate or compare information, and is not responsible for any Any information, advertising content, products or other materials provided by these websites/sources. All Users agree that Manulife IM (VN) shall not be responsible, directly or indirectly, for damages or losses caused or alleged to be caused by or in connection with the use or the reliability of any information, products or services provided by this external website. These connections are provided for convenience and for reference only. Manulife IM (VN) does not intend to advise investing in, buying or selling any securities, products or services provided by the company to which this website is linked; Manulife IM (VN) also has no responsibility to verify or confirm information on linked websites.
                    <br />
                    <br />
                    5. COPYRIGHT
                    The user acknowledges that the content, including but not limited to text, software, sound, images, videos, charts or other materials posted on this website (“Content” ) is protected under Copyright, Trademark, Patent or other Intellectual Property Laws or Agreements and Users are only allowed this Content with their express consent. clearly from MVFM. Users are not allowed to copy, reproduce, distribute or create variations from the Content of this website without the express consent of MVFM. However, Users can print out a number of information pages from the website and photocopy a certain number for internal information purposes in accordance with the Terms of Use. Users are not allowed to remove, change or falsify the content of notices related to copyright, trademarks, trade secrets or intellectual property rights appearing on or in this website.
                    <br />
                    <br />
                    6. INFORMATION SECURITY
                    All transmissions that Users send through this website, including email requests for information, are sent over public Internet networks that are not considered secure. Some other transmissions may be protected with encryption technology and will display a prompt. Additionally, all other transmissions are insecure.
                    <br />
                    <br />
                    7. RULES AMENDMENT
                    The Terms of Use may be amended from time to time without prior notice. When there are modifications, the updated content will be posted on wesbite. Modified terms of use will automatically take effect immediately when this content is updated on the website.
                    <br />
                    <br />
                    8. CHANGES AND TERMINATION OF THE WEBSITE
                    Manulife IM (VN) reserves the right to change or stop providing part or all of the content of this website, temporarily or permanently, with or without prior notice to Users, and is not required to provide support or update website. Users acknowledge and agree that Manulife IM (VN) is not responsible to Users or third parties in case the Company decides to modify, stop providing part or all of or not to update wesbite content. .
                    <br />
                    <br />
                    9. LIMITATION OF LIABILITY
                    This website is built on the basis of "as posted content". Manulife IM (VN) makes no warranties of any kind, express or implied, including but not limited to warranties relating to the information, services or products provided, offered for sale on or through connection to the website of Manulife IM (VN) or any implied warranty of purchasing ability
               </p>
            </div>
            <div className="flex items-end justify-end fixed bottom-0 right-0 mb-4 mr-4 z-10 mt-10">
                <div>
                    <Link title="Buy me a beer" to="/" target="_blank" className="block w-20 h-20 rounded-full transition-all shadow hover:shadow-lg transform hover:scale-110 hover:rotate-12 animate-bounce">
                        <img className="object-cover object-center w-full h-full rounded-full" src={naruto} />
                    </Link>   
                </div>
            </div>
        </section>
    )
}

export default Blogtroll