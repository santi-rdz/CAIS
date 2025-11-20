import Table from "@ui/Table";
import { useEffect, useState } from "react";
import UserRow from "./UserRow";

export default function UsersTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <Table columns="0.3fr 3.4fr 1.2fr 1.6fr 1.2fr 0.6fr">
      <Table.Header>
        <div></div>
        <div>Nombre</div>
        <div>Rol</div>
        <div>Ultimo login</div>
        <div>Estado</div>
      </Table.Header>
      <Table.Body data={users} render={(user) => <UserRow user={user} key={user.id} />} />
      <Table.Footer>Pagination</Table.Footer>
    </Table>
  );
}
