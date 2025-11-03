import { Icon } from '@iconify/react/dist/iconify.js';
import Pagination from './pagination';

interface TableHeader {
    title: string;
    field?: string;
    sortable: boolean;
}

interface CompleteTableProps {
    headers: TableHeader[];
    children: React.ReactNode;

    currentPage: number;
    lastPage: number;
    itemsPerPage: number;
    handlePageChange: (page: number) => void;
    handleItemsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleSortChange?: (column: string, order: 'asc' | 'desc') => void;

    sortBy?: string;
    sortOrder?: string;
}

export default function CompleteTable({
    headers,
    children,
    currentPage,
    lastPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    handleSortChange,
    sortBy,
    sortOrder
}: CompleteTableProps) {
    return (
        <div className="overflow-x-hidden ">
            <div
                className="overflow-x-auto  "
                style={{
                    scrollbarWidth: 'thin'
                }}
            >
                <div className={`border-gray-200 border-[1px] rounded-3xl mb-6`}>
                    <table className="min-w-full bg-[#FCFCFC] rounded-3xl overflow-hidden">
                        <thead>
                            <tr className="border-b border-gray-200">
                                {headers.map((header, index) => (
                                    <th key={index} className={`font-medium text-left text-gray-700 text-normal`}>
                                        <div
                                            className={`flex items-center justify-between pl-4 pr-2 py-4 ${index === 0 ? '' : 'border-l-[1px] border-gray-200'}`}
                                        >
                                            <span className="text-nowrap mr-2">{header.title}</span>

                                            <div className={`flex flex-row`}>
                                                {handleSortChange && header.sortable && header.field && (
                                                    <div className="flex flex-col cursor-pointer">
                                                        <Icon
                                                            icon="fa6-solid:sort-up"
                                                            className={`transition-opacity -mb-3 ${
                                                                sortBy === header.field && sortOrder === 'asc'
                                                                    ? 'opacity-100'
                                                                    : 'opacity-50'
                                                            }`}
                                                            onClick={() => handleSortChange(header.field!, 'asc')}
                                                        />
                                                        <Icon
                                                            icon="fa6-solid:sort-down"
                                                            className={`transition-opacity ${
                                                                sortBy === header.field && sortOrder === 'desc'
                                                                    ? 'opacity-100'
                                                                    : 'opacity-50'
                                                            }`}
                                                            onClick={() => handleSortChange(header.field!, 'desc')}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {children}
                    </table>
                </div>
            </div>
            <Pagination
                currentPage={currentPage}
                handleItemsPerPageChange={handleItemsPerPageChange}
                handlePageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                lastPage={lastPage}
            />
        </div>
    );
}

CompleteTable.displayName = 'CompleteTable';

export { CompleteTable };
