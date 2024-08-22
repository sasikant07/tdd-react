import React from "react";

const SignUpPage = () => {
  return (
    <div>
      <h1>Sign Up</h1>
      <label htmlFor="username">Username</label>
      <input type="text" id="username" />
      <label htmlFor="email">E-mail</label>
      <input type="email" id="email" />
      <label htmlFor="password">Password</label>
      <input type="password" id="password" />
      <label htmlFor="passwordRepeat">Password Repeat</label>
      <input type="password" id="passwordRepeat" />
      <button disabled>Sign Up</button>
    </div>
  );
};

export default SignUpPage;
