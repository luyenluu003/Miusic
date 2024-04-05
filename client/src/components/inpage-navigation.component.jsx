import { useEffect, useRef, useState } from "react";

const InPageNavigate = ({ routes, defaultHidden = [], defaultActiveIndex = 1, children }) => {
    let activeTabLineRef = useRef();
    let activeTabRef = useRef()
    let [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

    const changePageState = (btn, i) => {
        let { offsetWidth, offsetLeft } = btn;
        activeTabLineRef.current.style.width = offsetWidth + "px";
        activeTabLineRef.current.style.left = offsetLeft + "px";
        setInPageNavIndex(i);
    };

    useEffect(() => {
        changePageState(activeTabRef.current, defaultActiveIndex)
    }, [])

    return (
        <>
            <div className="relative mb-8  flex flex-nowrap bg-gray text-white overflow-x-auto justify-around md:justify-normal ">
                {routes.map((route, i) => (
                    <button
                        key={i}
                        ref={i == defaultActiveIndex ? activeTabRef : null}
                        className={
                            "p-4 px-5 capitalize" +
                            (inPageNavIndex == i ? " text-white" : " text-blue-gwen ") + (defaultHidden.includes(route) ? " md:hidden " : " ")
                        }
                        onClick={(e) => {
                            changePageState(e.target, i);
                        }}
                    >
                        {route}
                    </button>
                ))}
                <hr ref={activeTabLineRef} className="absolute bottom-0 duration-300 text-blue-gwen" />
            </div>

            {Array.isArray(children) ? children[inPageNavIndex] : children}
        </>
    );
};

export default InPageNavigate;
