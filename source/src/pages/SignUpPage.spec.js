import SignUpPage from "./SignUpPage";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import axios from "axios";
// import { TextEncoder, TextDecoder } from 'util';

// global.TextEncoder = TextEncoder;
// global.TextDecoder = TextDecoder;

const mockFn = jest.fn();
/* <----- Using fetch API ------>*/
// window.fetch = mockFn;

/* <----- Using Axios ------>*/
axios.post = mockFn;

describe("Sign Up Page", () => {
  describe("Layout", () => {
    it("has header", () => {
      render(<SignUpPage />);
      const header = screen.queryByRole("heading", { name: "Sign Up" });
      expect(header).toBeInTheDocument();
    });

    it("has username input", () => {
      //   const { container } = render(<SignUpPage />);
      //   const input = container.querySelector("input");
      render(<SignUpPage />);
      const input = screen.getByLabelText("Username");
      expect(input).toBeInTheDocument();
    });

    it("has email input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("E-mail");
      expect(input).toBeInTheDocument();
    });

    it("has password input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password");
      expect(input).toBeInTheDocument();
    });

    it("has password type for password input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password");
      expect(input.type).toBe("password");
    });

    it("has password repeat input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password Repeat");
      expect(input).toBeInTheDocument();
    });

    it("has password type for password repeat input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password Repeat");
      expect(input.type).toBe("password");
    });

    it("has Sign Up button", () => {
      render(<SignUpPage />);
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeInTheDocument();
    });

    it("diasbale the button initially", () => {
      render(<SignUpPage />);
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeDisabled();
    });
  });

  describe("Interactions", () => {
    let button;
    const setup = () => {
      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("E-mail");
      const passwordInput = screen.getByLabelText("Password");
      const passwordReapeatInput = screen.getByLabelText("Password Repeat");

      userEvent.type(usernameInput, "user1");
      userEvent.type(emailInput, "user1@mail.com");
      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(passwordReapeatInput, "P4ssword");
      button = screen.queryByRole("button", { name: "Sign Up" });
    };

    it("enables the button when password and password repeat fileds have same value", () => {
      setup();
      expect(button).toBeEnabled();
    });

    it("send username, email and password to backend after clicking the button", async () => {
      setup();

      userEvent.click(button);

      /* <------- These two lines for axios  ------->  */
      const firstCallOfMockFunction = mockFn.mock.calls[0];

      /* <---- Using fetch API -----> */
      // const body = JSON.parse(firstCallOfMockFunction[1]).body;

      /* <------- Using Axios   -------> */
      const body = firstCallOfMockFunction[1];

      /* <---- Using fetch API -----> */

      // await waitFor(() => {
      //   expect(window.fetch).toHaveBeenCalledWith("http://localhost:8080//api/1.0/users", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       username: "user1",
      //       email: "user1@mail.com",
      //       password: "P4ssword",
      //     }),
      //   });
      // });

      /* <------- Using Axios   -------> */

      await new Promise((resolve) => setTimeout(resolve, 500));
      expect(body).toEqual({
        username: "user1",
        email: "user1@mail.com",
        password: "P4ssword",
      });
    });

    it("disables button when there is an ongoing api call", async () => {
      let counter = 0;
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          counter += 1;
          return res(ctx.status(200));
        })
      );

      server.listen();
      setup();

      userEvent.click(button);
      userEvent.click(button);

      await new Promise((resolve) => setTimeout(resolve, 500));
      expect(counter).toBe(1);
    });

    it("displays spinner while  after clicking the submit", async () => {
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(200));
        })
      );

      server.listen();
      setup();

      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      userEvent.click(button);

      const spinner = screen.getByRole("status");

      expect(spinner).toBeInTheDocument();
    });

  });
});
