import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import '../SignIn-up/SignIn-up.css'
import { useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";
import Button from "../../Components/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FetchUser } from "../../Redux/Features/SignInSlice";

const Signin = () => {
  const { theme, getThemeStyle } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = (values) => {
    dispatch(FetchUser(values))
      .unwrap()
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        navigate('/');
      })
      .catch((err) => {
        console.log("LOGIN ERROR", err);
      });
  };



  return (
    <div className="auth-container" >
      <div className="auth-card">
        <h2>Sign In</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          style={getThemeStyle(theme)}
        >
          <Form>
            <Field type="email" name="email" placeholder="Email" style={getThemeStyle(theme)} />
            <ErrorMessage name="email" component="span" className="error" />

            <div className="password-field">
              <Field
                type={'password'}
                name="password"
                placeholder="Password"
                style={getThemeStyle(theme)}
              />
            </div>
            <ErrorMessage name="password" component="span" className="error" />

            <Button type="submit" className='signin-btn'>Sign In</Button>
            <div className="login-footer">
              <span className="login-text">
                Don't have an account?
                <Link to='/signup' className="login-link">SignUP</Link>
              </span>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Signin;
