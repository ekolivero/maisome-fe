'use client'

import { useSearchParams } from "next/navigation"
import Head from 'next/head'

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

    const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';

    // Modify the canonical URL to exclude 'page_number' when on the first page
    const canonicalUrl = currentPage === 1 ? baseUrl : `${baseUrl}?${updateSearchParams(currentPage)}`;
    const prevUrl = currentPage > 1 ? `${baseUrl}?${updateSearchParams(currentPage - 1)}` : null;
    const nextUrl = currentPage < totalPages ? `${baseUrl}?${updateSearchParams(currentPage + 1)}` : null;

    return (
        <>
            <Head>
                <link rel="canonical" href={canonicalUrl} />
                {prevUrl && <link rel="prev" href={prevUrl} />}
                {nextUrl && <link rel="next" href={nextUrl} />}
            </Head>
            <Pagination className="mt-4">
                <PaginationContent>
                    <PaginationItem className="hidden md:block">
                        {
                            currentPage > 1 && (
                                <PaginationPrevious
                                    href={currentPage - 1 === 1 ? baseUrl : `?${updateSearchParams(currentPage - 1)}`}
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
                                    href={Number(pageNum) === 1 ? baseUrl : `?${updateSearchParams(Number(pageNum))}`}
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
        </>
    )
}
