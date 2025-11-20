import UsersTable from "@features/user/UsersTable";
import UserTableOperations from "@features/user/userTableOperations";
import Heading from "@ui/Heading";
import Input from "@ui/Input";
import Row from "@ui/Row";
import { HiMagnifyingGlass } from "react-icons/hi2";

export default function Users() {
  return (
    <>
      <header className="mb-6">
        <Heading as="h1">Usuarios</Heading>
      </header>
      <Row>
        <Input
          className="w-[380px]"
          placeholder="Buscar usuario..."
          size="sm"
          variant="outline"
          suffix={<HiMagnifyingGlass className="" />}
        />
        <UserTableOperations />
      </Row>
      <UsersTable />
    </>
  );
}
