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
import { searchParamsCache } from '@/lib/nuqs/searchParams';

type Location = components["schemas"]["Location"];
type BaseLocation = components["schemas"]["BaseLocation"];

const formatUrl = (base: string, page: string) => {
    return `${base}/${page}`;
};

export function BreadcrumbsParentAndChildren({
    location,
}: {
    location: Location,
}) {
    const ids = searchParamsCache.get('ids')
    const breadcrumbPath = React.useMemo(() => getBreadcrumbPath(location), [location]);
    const baseUrl = `/vendita-case`;

    const hasMultipleLocations = ids && ids.length > 1;

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
                        <DropdownMenuTrigger className="flex items-center ml-2">
                            {formatLevel(item.level)}
                            <ChevronDown size={14} className="ml-2" />
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
        <Breadcrumb className={`${hasMultipleLocations ? "hidden" : "px-4 flex items-center"}`}>
            <BreadcrumbList className="flex items-center">
                <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="flex items-center">
                        <Home className="h-4 w-4" />
                        <span className="sr-only">Home</span>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {breadcrumbPath
                    .filter(item => item.level !== 0) // Filter out regions (level 0)
                    .map((item, index, arr) => (
                    <React.Fragment key={item.id}>
                        <BreadcrumbItem className={`flex items-center ${item.level === 1 ? "hidden md:flex" : ""}`}>
                            {
                                item.level === location.level ? (
                                    <BreadcrumbPage className="flex items-center">
                                        {item.level === 1 ? (
                                            <>
                                                <span className="hidden md:inline">Provincia di </span>
                                                <span className="inline-block max-w-[15ch] truncate md:max-w-none">{item.label}</span>
                                            </>
                                        ) : <span className="inline-block max-w-[15ch] truncate md:max-w-none">{item.label}</span>}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={formatUrl(baseUrl, item.page)} className="flex items-center">
                                        {item.level === 1 ? (
                                            <>
                                                <span className="hidden md:inline mr-1">Provincia di</span>
                                                <span className="inline-block max-w-[15ch] truncate md:max-w-none">{item.label}</span>
                                            </>
                                        ) : <span className="inline-block max-w-[15ch] truncate md:max-w-none">{item.label}</span>}
                                    </BreadcrumbLink>
                                )
                            }
                        </BreadcrumbItem>
                        <div className="flex items-center">
                            {index < arr.length - 1 && <BreadcrumbSeparator className={item.level === 1 ? "hidden md:block" : ""} />}
                            {renderChildrenCTA(item)}
                        </div>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export default BreadcrumbsParentAndChildren;