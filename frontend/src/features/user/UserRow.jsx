import Table from "@ui/Table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { HiEllipsisVertical } from "react-icons/hi2";

export default function UserRow({ user }) {
  const { name, role, lastLogin, email, status, picture } = user;
  const hasPicture = Boolean(picture);
  return (
    <Table.Row>
      <div className="flex items-center gap-2">
        <UserPicture>
          {hasPicture ? (
            <img src={picture} className="size-full" />
          ) : (
            <div className="flex size-full items-center justify-center">{email.at(0)}</div>
          )}
        </UserPicture>
        <Stacked>
          <span>{name ? name : "---"}</span>
          <span className="font-normal text-neutral-500">{email}</span>
        </Stacked>
      </div>
      <div className="capitalize">{role}</div>
      <div>{lastLogin ? format(lastLogin, "dd MMM yyyy", { locale: es }) : "---"}</div>
      <div>
        <Tag>{status}</Tag>
      </div>
      <div className="">
        <button className="flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-gray-100">
          <HiEllipsisVertical size={24} />
        </button>
      </div>
    </Table.Row>
  );
}

function Stacked({ children }) {
  return <div className="flex flex-col gap-1">{children}</div>;
}

function UserPicture({ children }) {
  return (
    <div alt="User Picture" className="h-10 w-10 overflow-hidden rounded-full bg-gray-200 object-cover">
      {children}
    </div>
  );
}

const statusStyles = {
  activo: "bg-green-200 text-green-700",
  inactivo: "bg-red-100 text-red-500",
  "registro enviado": "bg-blue-100 text-blue-600 ",
};

function Tag({ children }) {
  return <span className={`text-6 rounded-full px-3 py-1 capitalize ${statusStyles[children]}`}>{children}</span>;
}
