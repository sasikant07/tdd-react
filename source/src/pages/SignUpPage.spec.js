import SignUpPage from "./SignUpPage";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true, // Simulate a successful response
    json: () => Promise.resolve({}),
  })
);

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
    afterEach(() => {
      jest.resetAllMocks(); // Reset mocks after each test
    });
    it("enables the button when password and password repeat fileds have same value", () => {
      render(<SignUpPage />);
      const passwordInput = screen.getByLabelText("Password");
      const passwordReapeatInput = screen.getByLabelText("Password Repeat");
      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(passwordReapeatInput, "P4ssword");
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeEnabled();
    });

    it("send username, email and password to backend after clicking the button", async () => {
      render(<SignUpPage />);
      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("E-mail");
      const passwordInput = screen.getByLabelText("Password");
      const passwordReapeatInput = screen.getByLabelText("Password Repeat");

      userEvent.type(usernameInput, "user1");
      userEvent.type(emailInput, "user1@mail.com");
      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(passwordReapeatInput, "P4ssword");
      const button = screen.queryByRole("button", { name: "Sign Up" });

      userEvent.click(button);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/1.0/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "user1",
            email: "user1@mail.com",
            password: "P4ssword",
          }),
        });
      });
    });

    
  });
});
