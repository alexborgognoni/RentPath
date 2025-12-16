import { cn } from '@/lib/utils';
import {
    type ColumnDef,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onRowClick?: (row: TData) => void;
    className?: string;
}

export function DataTable<TData, TValue>({ columns, data, onRowClick, className }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    });

    return (
        <div className={cn('relative overflow-hidden rounded-xl border border-border bg-card', className)}>
            <div className="overflow-x-auto">
                <table role="grid" className="w-full">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-b border-border bg-muted/50">
                                {headerGroup.headers.map((header) => {
                                    const isSortable = header.column.getCanSort();
                                    const sortDirection = header.column.getIsSorted();

                                    return (
                                        <th
                                            key={header.id}
                                            scope="col"
                                            aria-sort={sortDirection ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                                            className={cn(
                                                'px-4 py-4 text-left text-sm font-semibold tracking-wide text-muted-foreground',
                                                isSortable && 'cursor-pointer select-none transition-colors hover:text-foreground',
                                            )}
                                            onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div className="flex items-center gap-2">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {isSortable && <SortIcon direction={sortDirection} />}
                                                </div>
                                            )}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-border">
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                role="row"
                                tabIndex={onRowClick ? 0 : undefined}
                                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                                onKeyDown={
                                    onRowClick
                                        ? (e) => {
                                              if (e.key === 'Enter' || e.key === ' ') {
                                                  e.preventDefault();
                                                  onRowClick(row.original);
                                              }
                                          }
                                        : undefined
                                }
                                className={cn('transition-colors', onRowClick && 'cursor-pointer hover:bg-muted/30 focus:bg-muted/30 focus:outline-none')}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-4 py-4">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function SortIcon({ direction }: { direction: false | 'asc' | 'desc' }) {
    if (direction === 'asc') {
        return <ArrowUp size={14} />;
    }
    if (direction === 'desc') {
        return <ArrowDown size={14} />;
    }
    return <ArrowUpDown size={14} className="opacity-50" />;
}
