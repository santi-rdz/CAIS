import { HiOutlinePlus } from "react-icons/hi2";
import Button from "@ui/Button";
import Modal from "@ui/Modal";
import SortBy from "@ui/SortBy";
import TableOperations from "@ui/TableOperations";
import UserModal from "./UserModal";
import { useNavigate } from "react-router";

const SORT_BY_OPTIONS = {
  "nombre-asc": { label: "Nombre (asc)", value: "nombre-asc" },
  "nombre-desc": { label: "Nombre (desc)", value: "nombre-desc" },
  "login-asc": { label: "Login (asc)", value: "login-asc" },
  "login-desc": { label: "Login (desc)", value: "login-desc" },
  clear: { label: "Limpiar", value: "clear" },
};

export default function UserTableOperations() {
  return (
    <TableOperations>
      <SortBy options={SORT_BY_OPTIONS} />
      <Modal>
        <Modal.Open opens="userModal">
          <Button size="md" className="py-2.5">
            <HiOutlinePlus size="16" strokeWidth="2.5" />
            Agregar usuario
          </Button>
        </Modal.Open>
        <Modal.Content name="userModal">
          <UserModal />
        </Modal.Content>
      </Modal>
    </TableOperations>
  );
}
