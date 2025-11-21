// Login.test.jsx
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router";
import Auth from "../pages/Auth";
import LoginForm from "@features/authenticaction/LoginForm";

function renderLoginPage() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route element={<Auth />}>
          <Route path="/login" element={<LoginForm />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("Login page", () => {
  it("should render page login", () => {
    renderLoginPage();
    expect(screen.getByRole("heading", { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it("should render email input", () => {
    renderLoginPage();
    expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
  });
  
  it("should render password input", () => {
    renderLoginPage();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  it("should render forgot password link", () => {
    renderLoginPage();
    expect(screen.getByRole("link", { name: /¿olvidaste tu contraseña\?/i })).toBeInTheDocument();
  });
  
  it("should render login button", () => {
    renderLoginPage();
    expect(screen.getByRole("button", { name: /iniciar sesión/i })).toBeInTheDocument();
  });
});
