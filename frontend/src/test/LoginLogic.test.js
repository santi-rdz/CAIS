import { it, describe, expect } from "vitest";

describe("Login", () => {
  it("Should be a function", () => {
    expect(typeof login).toBe("function");
  });
  it("should throw an error if no user or user/email is provided", () => {
    expect(() => login()).toThrow("Ingrese su usuario/correo");
  });
  it("should throw an error if no email is formatted", () => {
    expect(() => login()).toThrow("Correo electronico no valido!");
  });
  it("should throw an error if no password is provided", () => {
    expect(() => login()).toThrow("Ingrese su contraseña");
  });
});
