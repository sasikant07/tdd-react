import React, { useEffect, useState } from "react";
import axios from "axios";
import Input from "../components/Input";

const initialState = {
  username: "",
  email: "",
  password: "",
  passwordRepeat: "",
};

const SignUpPage = () => {
  const [apiProgress, setApiProgress] = useState(false);
  const [signupSuccess, setSignUpSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState(initialState);

  const submit = async (e) => {
    e.preventDefault();
    if (password !== passwordRepeat) {
      return; // You might want to handle this case more gracefully
    }
    const body = {
      username,
      email,
      password,
    };
    setApiProgress(true);

    try {
      await axios.post(`/api/1.0/users`, body);
      // setApiProgress(false);
      setSignUpSuccess(true);
    } catch (error) {
      if (error.response.status === 400) {
        setErrors({ errors: error.response.data.validationErrors });
        setApiProgress(false);
      }
    }
    // await fetch(`/api/1.0/users`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(body),
    // });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const errorCopy = { ...errors };
    delete errorCopy[id];
    setState({
      [id]: value,
      errors: errorCopy,
    });
  };

  let passwordMismatch = password !== passwordRepeat ? "Password mismatch" : "";

  return (
    <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
      {!signupSuccess && (
        <form
          className="card mt-5"
          onSubmit={submit}
          data-testid="form-sign-up"
        >
          <div className="card-header">
            <h1 className="text-center">Sign Up</h1>
          </div>
          <div className="card-body">
            <Input
              id="username"
              label="Username"
              onChange={handleChange}
              help={errors.username}
            />
            <Input
              id="email"
              label="E-mail"
              onChange={handleChange}
              help={errors.email}
            />
            <Input
              id="password"
              type="password"
              label="Password"
              onChange={handleChange}
              help={errors.password}
            />
            <Input
              id="passwordRepeat"
              type="password"
              label="Password Repeat"
              onChange={handleChange}
              help={passwordMismatch}
            />
            <div className="text-center">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={
                  password !== passwordRepeat ||
                  !password ||
                  !passwordRepeat ||
                  apiProgress
                }
              >
                {apiProgress && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></span>
                )}
                Sign Up
              </button>
            </div>
          </div>
        </form>
      )}
      {signupSuccess && (
        <div className="alert alert-success mt-3">
          Please check your e-mail to activate your account
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
