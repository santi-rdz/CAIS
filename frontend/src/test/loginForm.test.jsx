import "@testing-library/jest-dom"; // ✅ enables toBeInTheDocument and other matchers
import { render, fireEvent, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router";
import Auth from "../pages/Auth";
import LoginForm from "../features/authenticaction/LoginForm";

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

describe("Login form validation", () => {
  it("should show errors if fields are empty", async () => {
    renderLoginPage();
    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(await screen.findByText(/ingresa tu usuario/i)).toBeInTheDocument();
    expect(await screen.findByText(/ingresa tu contraseña/i)).toBeInTheDocument();
  });

  it("Should show an error if email format is invalid when no UABC domain is active", async () => {
    renderLoginPage();

    const toggle = screen.getByTestId("toggle-domain");
    // Cambiamos dominio no-uabc
    fireEvent.click(toggle);

    const emailInput = screen.getByLabelText(/correo/i);
    const passInput = screen.getByLabelText(/contraseña/i);

    fireEvent.change(emailInput, { target: { value: "invalidemail" } });
    fireEvent.change(passInput, { target: { value: "123456" } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(await screen.findByText(/Ingresa un correo valido/i)).toBeInTheDocument();
  });

  it("should not show errors when valid input is provided", () => {
    renderLoginPage();

    const emailInput = screen.getByLabelText(/usuario/i);
    const passInput = screen.getByLabelText(/contraseña/i);

    fireEvent.change(emailInput, { target: { value: "jhon.martinez29" } });
    fireEvent.change(passInput, { target: { value: "123456" } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(screen.queryByText(/Ingresa un correo valido/i)).toBeNull();
    expect(screen.queryByText(/Ingresa tu contraseña/i)).toBeNull();
    expect(screen.queryByText(/Ingresa tu usuario/i)).toBeNull();
  });

  it("renders username/email and password inputs", () => {
    renderLoginPage();
    const userInput = screen.getByLabelText(/usuario/i);
    const passInput = screen.getByLabelText(/contraseña/i);
    expect(userInput).toBeInTheDocument();
    expect(passInput).toBeInTheDocument();
  });
});
