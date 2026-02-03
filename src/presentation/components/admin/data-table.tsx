'use client';

import React from 'react';
import { Pagination } from '@/presentation/components/common/pagination';

export interface TableHeader {
    label: string;
    className?: string; // Applied primarily to cells, but also headers
    headerClassName?: string; // Optional specific header override
    align?: 'left' | 'right' | 'center';
}

export interface TableAction {
    label: string;
    icon: React.ReactNode;
    onClick: () => void | Promise<void>;
    className?: string;
    variant?: 'default' | 'danger';
}

export interface TableCell {
    content?: React.ReactNode;
    actions?: TableAction[];
    className?: string;
    align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
    data: T[];
    headers: TableHeader[];
    renderRow: (item: T) => TableCell[];
    loading?: boolean;
    emptyMessage?: string;
    rowKey: (item: T) => string | number;
    minWidth?: string;

    // Pagination props
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
        onPageChange: (page: number) => void;
        onPageSizeChange: (size: number) => void;
    };
}

function DataTableActions({ actions }: { actions: TableAction[] }) {
    return (
        <div className="flex items-center gap-1 md:gap-2">
            {actions.map((action, idx) => (
                <button
                    key={idx}
                    onClick={(e) => {
                        e.stopPropagation();
                        action.onClick();
                    }}
                    className={`p-1.5 md:p-2.5 rounded-full transition-all active:scale-90 ${action.className ||
                        (action.variant === 'danger'
                            ? 'hover:bg-neutral-100 text-text-muted hover:text-black'
                            : 'hover:bg-neutral-100 text-text-muted hover:text-black')
                        }`}
                    title={action.label}
                >
                    <div className="scale-90 md:scale-100">
                        {action.icon}
                    </div>
                </button>
            ))}
        </div>
    );
}

export function DataTable<T>({
    data,
    headers,
    renderRow,
    loading = false,
    emptyMessage = 'No data found.',
    rowKey,

    pagination,
}: DataTableProps<T>) {
    return (
        <div className="space-y-6">
            {/* Unified Table & Pagination Card */}
            <div className="bg-white rounded-md md:rounded-md shadow-sm border border-black/20 overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide">


                    <table className="w-full text-center border-collapse">
                        <thead className="border-b border-black/20 bg-black/5">
                            <tr>
                                {headers.map((header, idx) => (
                                    <th
                                        key={idx}
                                        className={`px-3 py-4 font-bold text-black  text-[10px] sm:text-xs md:text-sm tracking-wider uppercase ${header.className || ''} ${header.headerClassName || ''} ${header.align === 'right' ? 'text-right' : header.align === 'center' ? 'text-center' : ''
                                            }`}
                                    >
                                        {header.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>



                        <tbody className="divide-y divide-black/10">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={headers.length}
                                        className="p-8 md:p-12 text-center text-black"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-xs md:text-sm font-medium">Loading inventory...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={headers.length}
                                        className="p-8 md:p-12 text-center text-black"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-sm md:text-base">{emptyMessage}</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                data.map((item) => (
                                    <tr key={rowKey(item)} className="group hover:bg-black/10 transition-colors">
                                        {renderRow(item).map((cell, idx) => {
                                            const headerConfig = headers[idx];
                                            const align = cell.align || headerConfig?.align;
                                            return (
                                                <td
                                                    key={idx}
                                                    className={`px-3 py-4 text-xs md:text-sm lg:text-base text-black ${headerConfig?.className || ''} ${cell.className || ''} ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : ''
                                                        }`}
                                                >
                                                    <div className={`flex items-center gap-2 md:gap-3 ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : ''}`}>
                                                        <div className="flex-1 min-w-0">
                                                            {cell.content}
                                                        </div>
                                                        {cell.actions && cell.actions.length > 0 && (
                                                            <div className="shrink-0">
                                                                <DataTableActions actions={cell.actions} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Integrated) */}
                {pagination && !loading && data.length > 0 && (
                    <div className="border-t border-black/10 text-black">
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            totalItems={pagination.totalItems}
                            pageSize={pagination.pageSize}
                            onPageChange={pagination.onPageChange}
                            onPageSizeChange={pagination.onPageSizeChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
