import express from "express";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Hola desde backend!" });
});

// Simulación de base de datos en memoria
const patients = [];
let patientIdCounter = 1;

// Endpoint para registrar un nuevo paciente
app.post("/api/patients", (req, res) => {
  const { nombre, apellido, fechaNacimiento, telefono, email, direccion } = req.body;

  // Validación básica
  if (!nombre || !apellido || !fechaNacimiento) {
    return res.status(400).json({ 
      error: "Nombre, apellido y fecha de nacimiento son requeridos" 
    });
  }

  const newPatient = {
    id: patientIdCounter++,
    nombre,
    apellido,
    fechaNacimiento,
    telefono: telefono || "",
    email: email || "",
    direccion: direccion || "",
    fechaRegistro: new Date().toISOString()
  };

  patients.push(newPatient);
  res.status(201).json(newPatient);
});

// Endpoint para obtener todos los pacientes
app.get("/api/patients", (req, res) => {
  res.json(patients);
});

const server = app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});

export default server;
