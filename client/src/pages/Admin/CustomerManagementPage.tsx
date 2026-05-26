import { useEffect, useState, useCallback } from "react";
import { useModal } from "../../hooks/useModal";
import CustomerList from "./components/CustomerList";
import AddCustomerFormModal from "./components/AddCustomerFormModal";
import EditCustomerFormModal from "./components/EditCustomerFormModal";
import DeleteCustomerFormModal from "./components/DeleteCustomerFormModal";
import CustomerService from "../../services/CustomerService";
import type { CustomerColumns, CustomerPagination } from "../../interfaces/CustomerInterfaces";
import PageHeader from "../../components/Layout/PageHeader";

const CustomerMainPage = () => {
    const addModal    = useModal(false);
    const editModal   = useModal(false);
    const deleteModal = useModal(false);

    const [customers, setCustomers]         = useState<CustomerColumns[]>([]);
    const [pagination, setPagination]       = useState<Omit<CustomerPagination, "data"> | null>(null);
    const [selectedCustomer, setSelected]   = useState<CustomerColumns | null>(null);
    const [isLoading, setIsLoading]         = useState(false);
    const [search, setSearch]               = useState("");
    const [page, setPage]                   = useState(1);

    useEffect(() => {
        document.title = "Customer Management";
    }, []);

    const fetchCustomers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await CustomerService.loadCustomers(page, search);
            const data: CustomerPagination = res.data.customers;
            setCustomers(data.data);
            setPagination({
                current_page: data.current_page,
                last_page:    data.last_page,
                per_page:     data.per_page,
                total:        data.total,
            });
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleEdit = (customer: CustomerColumns) => {
        setSelected(customer);
        editModal.openModal();
    };

    const handleDelete = (customer: CustomerColumns) => {
        setSelected(customer);
        deleteModal.openModal();
    };

    return (
        <>
            <PageHeader
                title="Customers"
                description="Customers from POS, delivery, and recurring orders."
            />

            <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="button"
                    onClick={() => addModal.openModal()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow"
                >
                    + Add Customer
                </button>
            </div>

            <CustomerList
                customers={customers}
                isLoading={isLoading}
                pagination={pagination}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPageChange={setPage}
            />

            <AddCustomerFormModal
                isOpen={addModal.isOpen}
                onClose={addModal.closeModal}
                onSuccess={() => { addModal.closeModal(); fetchCustomers(); }}
            />

            <EditCustomerFormModal
                isOpen={editModal.isOpen}
                onClose={editModal.closeModal}
                customer={selectedCustomer}
                onSuccess={() => { editModal.closeModal(); fetchCustomers(); }}
            />

            <DeleteCustomerFormModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
                customer={selectedCustomer}
                onSuccess={() => { deleteModal.closeModal(); fetchCustomers(); }}
            />
        </>
    );
};

export default CustomerMainPage;