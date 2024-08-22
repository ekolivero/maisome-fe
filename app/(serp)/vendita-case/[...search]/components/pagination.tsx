'use client'

import { useSearchParams } from "next/navigation"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export default function PaginationComponent({
    pageRange,
    currentPage,
    totalPages
}: {
    pageRange: (string | number | '...')[],
    currentPage: number,
    totalPages: number
}) {

    const searchParams = useSearchParams();

    const updateSearchParams = (newPage: number) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('page_number', newPage.toString());
        return current.toString();
    };

    return (
        <Pagination className="mt-4">
            <PaginationContent>
                <PaginationItem className="hidden md:block">
                    {
                        currentPage > 1 && (
                            <PaginationPrevious
                                href={`?${updateSearchParams(currentPage - 1)}`}
                                aria-disabled={currentPage === 1}
                            />
                        )
                    }
                </PaginationItem>
                {pageRange.map((pageNum, index) => (
                    <PaginationItem key={index}>
                        {pageNum === '...' ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                href={`?${updateSearchParams(Number(pageNum))}`}
                                isActive={pageNum === currentPage}
                            >
                                {pageNum}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}
                <PaginationItem className="hidden md:block">
                    {
                        currentPage < totalPages && (
                            <PaginationNext
                                href={`?${updateSearchParams(currentPage + 1)}`}
                                aria-disabled={currentPage === totalPages}
                            />
                        )
                    }
                    
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}