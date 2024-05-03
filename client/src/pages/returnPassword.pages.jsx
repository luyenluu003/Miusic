import { Toaster, toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import { storeInSession } from "../common/session";

const ReturnPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const handleSubmit = (e) => {
        e.preventDefault();

        const form = new FormData(document.getElementById("formElment"));
        const password = form.get("password");
        const returnpassword = form.get("returnpassword");
        console.log("password", password);
        console.log("returnpassword", returnpassword);

        // Kiểm tra dữ liệu đầu vào
        if (!password || !returnpassword) {
            return toast.error("Please fill in all fields.");
        }

        if (password !== returnpassword) {
            return toast.error("Passwords do not match.");
        }

        const email = location.state?.formData?.email;
        console.log("email", email);

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-password", { email, password }).then(({ data }) => {
            console.log("data",data)
            toast.success("Password updated successfully!");
            storeInSession("user", JSON.stringify(data));
            navigate("/signin");
        })
        .catch((err) => {
            toast.error("An error occurred.");
          });
    };

    return (
        <AnimationWrapper>
            <section className="h-cover flex items-center justify-center bg-gray-900">
                <Toaster />
                <form id="formElment" className="w-[80%] max-w-[400px] mb-[5%]" onSubmit={handleSubmit}>
                    <h1 className="text-4xl text-white font-gelasio capitalize text-center mb-5">
                        Change Password
                    </h1>

                    <InputBox
                        name="password"
                        type="password"
                        placeholder="New password"
                        icon="fi-rr-key"
                    />
                    <InputBox
                        name="returnpassword"
                        type="password"
                        placeholder="Enter the password again"
                        icon="fi-rr-key"
                    />

                    <button className="btn-blue-gwen center mt-14" type="submit">
                        Confirm
                    </button>
                </form>
            </section>
        </AnimationWrapper>
    );
};

export default ReturnPassword;
