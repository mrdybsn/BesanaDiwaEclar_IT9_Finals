import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";

interface UserListProps {
    onEdit: () => void;
    onDelete: () => void;
}

const UserList = ({ onEdit, onDelete }: UserListProps) => {
    const users = [
        {
            user_id: 1,
            full_name: "Dela Cruz, Juan M.",
            username: "jdelacruz",
            role: "Admin",
            contact_number: "09123456789",
            birth_date: "1990-01-15",
            age: 35,
            is_active: true,
        },
        {
            user_id: 2,
            full_name: "Santos, Maria L.",
            username: "msantos",
            role: "Staff",
            contact_number: "09234567890",
            birth_date: "1995-03-22",
            age: 30,
            is_active: true,
        },
        {
            user_id: 3,
            full_name: "Reyes, Carlo B.",
            username: "creyes",
            role: "Rider",
            contact_number: "09345678901",
            birth_date: "1988-07-08",
            age: 36,
            is_active: false,
        },
    ];

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="max-w-full max-h-[calc(100vh)] overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-200 bg-blue-600 sticky text-white top-0 text-xs">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                No.
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">
                                Full Name
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">
                                Username
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">
                                Role
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">
                                Contact No.
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">
                                Birth Date
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                Age
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                Status
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
                        {users.map((user, index) => (
                            <TableRow className="hover:bg-gray-100" key={index}>
                                <TableCell className="px-4 py-3 text-center">
                                    {user.user_id}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    {user.full_name}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    {user.username}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    {user.role}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    {user.contact_number}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    {user.birth_date}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                    {user.age}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            user.is_active
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {user.is_active ? "Active" : "Inactive"}
                                    </span>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                    <div className="flex gap-4 justify-center">
                                        <button
                                            type="button"
                                            onClick={onEdit}
                                            className="text-green-600 hover:underline font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onDelete}
                                            className="text-red-600 hover:underline font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default UserList;