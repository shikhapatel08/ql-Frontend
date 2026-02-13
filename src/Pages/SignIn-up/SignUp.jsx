import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import '../SignIn-up/SignIn-up.css'
import Button from "../../Components/Button/Button";
import { useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";


const Signup = () => {
    const { theme, getThemeStyle } = useContext(ThemeContext);


    const initialValues = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),
        password: Yup.string()
            .min(6, "Minimum 6 characters")
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Confirm password is required"),
    });

    const handleSubmit = (values) => {
        console.log("Signup values:", values);
    };

    return (
        <div className="auth-container" >
            <div className="auth-card">
                <h2>Sign Up</h2>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form >
                        <Field type="text" name="name" placeholder="Full Name" style={getThemeStyle(theme)} />
                        <ErrorMessage name="name" component="span" className="error" />

                        <Field type="email" name="email" placeholder="Email" style={getThemeStyle(theme)} />
                        <ErrorMessage name="email" component="span" className="error" />

                        <div className="password-field">
                            <Field
                                type={"password"}
                                name="password"
                                placeholder="Password"
                                style={getThemeStyle(theme)}
                            />
                        </div>
                        <ErrorMessage name="password" component="span" className="error" />

                        <Field
                            type={"password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            style={getThemeStyle(theme)}
                        />
                        <ErrorMessage
                            name="confirmPassword"
                            component="span"
                            className="error"
                        />
                        <br />
                        <Button type="submit">Create Account</Button>
                    </Form>
                </Formik>
            </div>
        </div>
    );
};

export default Signup;
