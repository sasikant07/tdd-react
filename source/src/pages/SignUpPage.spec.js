import SignUpPage from "./SignUpPage";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
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
    let requestBody;
    let counter = 0;
    const server = setupServer(
      rest.post("/api/1.0/users", (req, res, ctx) => {
        requestBody = req.body;
        counter += 1;
        return res(ctx.status(200));
      })
    );

    beforeEach(() => {
      counter = 0;
      server.resetHandlers();
    });

    beforeAll(() => server.listen());
    afterAll(() => server.close());

    let button, usernameInput, emailInput, passwordInput, passwordReapeatInput;
    const setup = () => {
      usernameInput = screen.getByLabelText("Username");
      emailInput = screen.getByLabelText("E-mail");
      passwordInput = screen.getByLabelText("Password");
      passwordReapeatInput = screen.getByLabelText("Password Repeat");

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

      await screen.findByText(
        "Please check your e-mail to activate your account"
      );
      expect(body).toEqual({
        username: "user1",
        email: "user1@mail.com",
        password: "P4ssword",
      });
    });

    it("disables button when there is an ongoing api call", async () => {
      setup();

      userEvent.click(button);
      userEvent.click(button);

      await screen.findByText(
        "Please check your e-mail to activate your account"
      );
      expect(counter).toBe(1);
    });

    it("displays spinner while  after clicking the submit", async () => {
      setup();

      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      userEvent.click(button);

      const spinner = screen.getByRole("status");

      expect(spinner).toBeInTheDocument();

      await screen.findByText(
        "Please check your e-mail to activate your account"
      );
    });

    it("displays account activation notification after successfull sign up request", async () => {
      setup();

      const message = "Please check your e-mail to activate your account";
      expect(screen.queryByText(message)).not.toBeInTheDocument();

      userEvent.click(button);
      const text = await screen.findByText(message);
      expect(text).toBeInTheDocument();
    });

    it("hides sign up form after successfull sign up request", async () => {
      setup();

      const form = screen.getByTestId("form-sign-up");
      userEvent.click(button);

      await waitFor(() => {
        expect(form).not.toBeInTheDocument();
      });

      /* <----- Alternative for above waitFor() ---> */
      // await waitForElementToBeRemoved(form);
    });

    const generateValidationError = (field, message) => {
      return rest.post("/api/1.0/users", (req, res, ctx) => {
        requestBody = req.body;
        counter += 1;
        return res(
          ctx.status(400),
          ctx.json({
            validationErrors: { [field]: message },
          })
        );
      });
    };

    it.each`
      field         | message
      ${"username"} | ${"Username cannot be null"}
      ${"email"}    | ${"E-mail cannot be null"}
      ${"password"} | ${"Password cannot be null"}
    `("displays $message for $field", async ({ field, message }) => {
      server.use(generateValidationError(field, message));

      setup();

      userEvent.click(button);
      const validationError = await screen.findByText(message);
      expect(validationError).toBeInTheDocument();
    });

    it("hides spinner and enables button after response received", async () => {
      server.use(
        generateValidationError("username", "Username cannot be null")
      );

      setup();

      userEvent.click(button);
      await screen.findByText("Username cannot be null");

      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(button).toBeEnabled();
    });

    it("displays mismatch message for password repeat input"),
      () => {
        setup();
        userEvent.type(passwordInput, "P4ssword");
        userEvent.type(passwordReapeatInput, "P4ssword");
        const validationError = screen.queryByText("Password mismatch");
        expect(validationError).toBeInTheDocument();
      };

    it.each`
      field         | message                      | label
      ${"username"} | ${"Username cannot be null"} | ${"Username"}
      ${"email"}    | ${"E-mail cannot be null"}   | ${"E-mail"}
      ${"password"} | ${"Password cannot be null"} | ${"Password"}
    `(
      "clears validation error after $field is updated",
      async ({ field, message, label }) => {
        server.use(generateValidationError(field, message));

        setup();

        userEvent.click(button);

        const validationError = await screen.findByText(message);
        userEvent.type(screen.getByLabelText(label), "updated");
        expect(validationError).not.toBeInTheDocument();
      }
    );
  });
});
