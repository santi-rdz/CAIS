export default function Pacientes() {
  return (
    <>
      <div className="text-1 font-bold">Pacientes</div>
      <div className="pacientes_table">
        {
          <table>
            <thead>
              <tr className="m-10">
                <th>Nombre</th>
                <th>Ultima Actualización</th>
                <th>Fecha de nacimiento</th>
                <th>Sexo</th>
                <th>Acciones</th>
              </tr>
            </thead>
          </table>
        }
      </div>
    </>
  );
}
