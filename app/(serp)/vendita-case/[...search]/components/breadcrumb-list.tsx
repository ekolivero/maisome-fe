'use client'
import React from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Home } from 'lucide-react';
import { components } from "@/app/types/schema"
import { getBreadcrumbPath, getChildrenForLocation } from '../utils/breadcrumb';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { SearchParamsProps } from '../page';


type Location = components["schemas"]["Location"];
type BaseLocation = components["schemas"]["BaseLocation"];

const trimText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength - 1).trim() + '…';
};

const formatUrl = (base: string, page: string) => {
    return `${base}/${page}`;
};

export function BreadcrumbsParentAndChildren({
    location,
    searchParams
}: {
    location: Location,
    searchParams: SearchParamsProps
}) {
    const breadcrumbPath = React.useMemo(() => getBreadcrumbPath(location), [location]);
    const baseUrl = `/vendita-case`;

    const isMobile = useMediaQuery('(max-width: 768px)');

    const hasMultipleLocations = searchParams.ids && searchParams.ids.length > 1;

    const formatLevel = (level: number) => {
        switch (level) {
            case 1:
                return "Vedi Area";
            case 2:
                return "Vedi Comune";
            case 3:
                return "Vedi Zona";
            case 4:
                return "Vedi Quartiere";
            default:
                return "";
        }
    }

    const renderChildrenCTA = (item: BaseLocation | Location) => {
        const children = getChildrenForLocation(item);
        if (children.length > 0) {
            return (
                <>
                    <BreadcrumbSeparator />
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            {formatLevel(item.level)}
                            <ChevronDown size={14} className="inline ml-1" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="overflow-auto max-h-96">
                            {children.map((child) => (
                                <DropdownMenuItem key={child.id}>
                                    <BreadcrumbLink href={formatUrl(baseUrl, child.page)} className="w-full">
                                        {child.label}
                                    </BreadcrumbLink>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            );
        }
        return null;
    };

    return (
        <Breadcrumb className={`${hasMultipleLocations ? "hidden" : "px-4 flex"}`}>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">
                        <Home className="h-4 w-4" />
                        <span className="sr-only">Home</span>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {breadcrumbPath
                    .filter(item => item.level !== 0) // Filter out regions (level 0)
                    .map((item, index, arr) => (
                    <React.Fragment key={item.id}>
                        <BreadcrumbItem className={item.level === 1 ? "hidden md:block" : ""}>
                            {
                                item.level === location.level ? (
                                    <BreadcrumbPage>
                                        {item.level === 1 ? (
                                            <>
                                                <span className="hidden md:inline">Provincia di </span>
                                                {isMobile ? trimText(item.label, 15) : item.label}
                                            </>
                                        ) : isMobile ? trimText(item.label, 15) : item.label}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={formatUrl(baseUrl, item.page)}>
                                        {item.level === 1 ? (
                                            <>
                                                <span className="hidden md:inline">Provincia di </span>
                                                {isMobile ? trimText(item.label, 15) : item.label}
                                            </>
                                        ) : isMobile ? trimText(item.label, 15) : item.label}
                                    </BreadcrumbLink>
                                )
                            }
                        </BreadcrumbItem>
                        <>
                            {index < arr.length - 1 && <BreadcrumbSeparator className={item.level === 1 ? "hidden md:block" : ""} />}
                            {renderChildrenCTA(item)}
                        </>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export default BreadcrumbsParentAndChildren;