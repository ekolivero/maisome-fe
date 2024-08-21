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
    location
}: {
    location: Location
}) {
    const breadcrumbPath = React.useMemo(() => getBreadcrumbPath(location), [location]);
    const baseUrl = `/vendita-case`;

    const formatLevel = (level: number) => {
        switch (level) {
            case 0:
                return "Vedi Provincie";
            case 1:
                return "Vedi Comuni";
            case 2:
                return "Vedi Aree";
            case 3:
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
                                <BreadcrumbLink href={formatUrl(baseUrl, child.page)}>
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
        <Breadcrumb className="px-3 md:flex">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">
                        <Home className="h-4 w-4" />
                        <span className="sr-only">Home</span>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {breadcrumbPath.slice(location.level === 3 ? -3 : -4).map((item, index, arr) => (
                    <React.Fragment key={item.id}>
                        <BreadcrumbItem>
                            {
                                item.level === location.level ? (
                                    <BreadcrumbPage>{trimText(item.label, 15)}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={formatUrl(baseUrl, item.page)}>{trimText(item.label, 15)}</BreadcrumbLink>
                                )
                            }
                        </BreadcrumbItem>
                        <>
                            {index < arr.length - 1 && <BreadcrumbSeparator />}
                            {renderChildrenCTA(item)}
                        </>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export default BreadcrumbsParentAndChildren;