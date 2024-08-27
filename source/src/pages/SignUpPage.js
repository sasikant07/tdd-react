import React, { useEffect, useState } from "react";
import axios from "axios";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

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
    axios.post(`/api/1.0/users`, body);
    // await fetch(`/api/1.0/users`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(body),
    // });
  };

  return (
    <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
      <form className="card mt-5" onSubmit={submit}>
        <div className="card-header">
          <h1 className="text-center">Sign Up</h1>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              className="form-control"
              type="text"
              id="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              E-mail
            </label>
            <input
              className="form-control"
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              className="form-control"
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="passwordRepeat" className="form-label">
              Password Repeat
            </label>
            <input
              className="form-control"
              type="password"
              id="passwordRepeat"
              onChange={(e) => setPasswordRepeat(e.target.value)}
            />
          </div>
          <div className="text-center">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={
                password !== passwordRepeat || !password || !passwordRepeat
              }
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
