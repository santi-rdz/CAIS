import "@testing-library/jest-dom"; // ✅ enables toBeInTheDocument and other matchers
import { render, fireEvent, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router";
import Login from "../pages/Login";

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("Login form validation", () => {
  it("should show errors if fields are empty", () => {
    renderWithRouter(<Login />);
    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(screen.getByText(/ingresa tu usuario|Ingresa tu correo electronico/i));
    expect(screen.getByText(/ingresa tu contraseña/i));
  });

  it("Should show an error if email format is invalid when no UABC domain is active", () => {
    renderWithRouter(<Login />);

    const toggle = screen.getByTestId("toggle-domain");
    // Cambiamos dominio no-uabc
    fireEvent.click(toggle);

    const emailInput = screen.getByLabelText(/correo/i);
    const passInput = screen.getByLabelText(/contraseña/i);

    fireEvent.change(emailInput, { target: { value: "invalidemail" } });
    fireEvent.change(passInput, { target: { value: "123456" } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(screen.getByText(/Ingresa un correo valido/i)).toBeInTheDocument();
  });

  it("should not show errors when valid input is provided", () => {
    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText(/usuario/i);
    const passInput = screen.getByLabelText(/contraseña/i);

    fireEvent.change(emailInput, { target: { value: "user@uabc.edu.mx" } });
    fireEvent.change(passInput, { target: { value: "123456" } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(screen.queryByText(/Ingresa un correo valido/i)).toBeNull();
    expect(screen.queryByText(/Ingresa tu contraseña/i)).toBeNull();
    expect(screen.queryByText(/Ingresa tu usuario|Ingresa tu correo electronico/i)).toBeNull();
  });

  it("renders username/email and password inputs", () => {
    renderWithRouter(<Login />);
    const userInput = screen.getByLabelText(/usuario/i);
    const passInput = screen.getByLabelText(/contraseña/i);
    expect(userInput).toBeInTheDocument();
    expect(passInput).toBeInTheDocument();
  });
});
