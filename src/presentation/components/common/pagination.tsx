'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export const Pagination = ({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
}: PaginationProps) => {
    const pageSizes = [10, 25, 50, 100];
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-secondary/10 bg-white">
            {/* Items info and page size selector */}
            <div className="flex items-center gap-4 text-sm text-black">
                <span>
                    Showing {startItem} to {endItem} of {totalItems} items
                </span>
                <div className="flex items-center gap-2">
                    <label htmlFor="pageSize" className="text-black">
                        Per page:
                    </label>
                    <select
                        id="pageSize"
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className="border border-black/20 rounded-lg px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                        {pageSizes.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={cn(
                        "p-2 rounded-lg transition-colors",
                        currentPage === 1
                            ? "text-black cursor-not-allowed"
                            : "text-black hover:bg-black/10"
                    )}
                >
                    <ChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }

                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={cn(
                                    "min-w-[40px] h-10 rounded-lg font-medium transition-colors",
                                    currentPage === pageNum
                                        ? "bg-black text-white"
                                        : "text-black bg-black/10 hover:bg-black/30"
                                )}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={cn(
                        "p-2 rounded-lg transition-colors",
                        currentPage === totalPages || totalPages === 0
                            ? "text-black cursor-not-allowed"
                            : "text-black hover:bg-black/10"
                    )}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};
