// Login.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Login from "../pages/Auth";
import { BrowserRouter } from "react-router";

describe("Login page", () => {
  it("should render page login", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );
  });

  it("should render title", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    expect(screen.getByRole("heading", { name: /iniciar sesión/i }));
  });
  it("should render email input", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    expect(screen.getByLabelText(/usuario|correo electronico/i));
  });
  it("should render password input", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    expect(screen.getByLabelText(/contraseña/i));
  });

  it("should render forgot password link", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    expect(screen.getByRole("link", { name: /¿Olvidaste tu contraseña?/i }));
  });
  it("should render login button", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    expect(screen.getByRole("button", { name: "Iniciar Sesión" }));
  });
});
