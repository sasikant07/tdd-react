import React, { useEffect, useState } from "react";

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
    await fetch(`/api/1.0/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  };

  return (
    <div>
      <form onSubmit={submit}>
        <h1>Sign Up</h1>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="passwordRepeat">Password Repeat</label>
        <input
          type="password"
          id="passwordRepeat"
          onChange={(e) => setPasswordRepeat(e.target.value)}
        />
        <button
          type="submit"
          disabled={password !== passwordRepeat || !password || !passwordRepeat}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
