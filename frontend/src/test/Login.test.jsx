// Login.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Login from "../pages/Login";
import { BrowserRouter } from "react-router";

describe("Login page", () => {
  it("should render correctly", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  });

  it("should render title", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByRole("heading", { name: "Iniciar Sesión" }));
  });
});
