import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Pacientes from "../pages/Pacientes";
import App from "../App";
import { BrowserRouter } from "react-router";

describe("Pacientes page", () => {
  it("should render page pacientes", () => {
    render(
      <BrowserRouter>
        <Pacientes />
      </BrowserRouter>,
    );
  });

  it("should render title", () => {
    render(
      <BrowserRouter>
        <Pacientes />
      </BrowserRouter>,
    );

    expect(screen.getByText("Pacientes"));
  });

  it("should have search bar", () => {
    render(<App />);
    expect(screen.getByPlaceholderText("Buscar paciente..."));
  });

  it('should have button "+ Nuevo Paciente"', () => {
    render(<App />);

    expect(screen.getAllByRole("button", { name: "+ Nuevo paciente" }, { hidden: true }));
  });

  it("should render table", () => {
    render(
      <BrowserRouter>
        <Pacientes />
      </BrowserRouter>,
    );

    expect(screen.getByRole("table"));
  });
});
