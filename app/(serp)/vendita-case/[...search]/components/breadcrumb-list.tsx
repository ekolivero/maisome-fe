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
import { getBreadcrumbPath, getChildrenForLocation, isLocation, getNeighborsForLocation } from '../utils/breadcrumb';

type Location = components["schemas"]["Location"];
type BaseLocation = components["schemas"]["BaseLocation"];

const trimText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength - 1).trim() + '…';
};

const formatUrl = (base: string, label: string) => {
    const encodedLabel = encodeURIComponent(label.toLowerCase().replace(/[\s,/-]+/g, '-').replace(/^-+|-+$/g, ''));
    return `${base}/${encodedLabel}`;
};

export function BreadcrumbsParentAndChildren({
    location
}: {
    location: Location
}) {
    const breadcrumbPath = React.useMemo(() => getBreadcrumbPath(location), [location]);
    const baseUrl = `/vendita-case/${location.page.split('/')[0]}`;

    const renderDropdownMenu = (items: BaseLocation[], title: string) => (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center focus:outline-none">
                <span className="mr-1">{trimText(title, 15)}</span>
                <ChevronDown size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem disabled>{title}</DropdownMenuItem>
                {items.map((item) => (
                    <DropdownMenuItem key={item.id}>
                        <BreadcrumbLink href={formatUrl(baseUrl, item.label)}>
                            {item.label}
                        </BreadcrumbLink>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );

    const renderChildrenCTA = (item: BaseLocation | Location) => {
        const children = getChildrenForLocation(item);
        if (children.length > 0) {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        Vedi quartieri <ChevronDown size={14} className="inline ml-1" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {children.map((child) => (
                            <DropdownMenuItem key={child.id}>
                                <BreadcrumbLink href={formatUrl(baseUrl, child.label)}>
                                    {child.label}
                                </BreadcrumbLink>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
        return null;
    };

    return (
        <Breadcrumb className="px-3">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">
                        <Home className="h-4 w-4" />
                        <span className="sr-only">Home</span>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {breadcrumbPath.slice(location.level === 3 ? -2 : -3).map((item, index, arr) => (
                    <React.Fragment key={item.id}>
                        <BreadcrumbItem>
                            {index === arr.length - 1 && isLocation(item) && getNeighborsForLocation(item).length > 0 ? (
                                renderDropdownMenu(getNeighborsForLocation(item), item.label)
                            ) : (
                                <BreadcrumbPage>{trimText(item.label, 15)}</BreadcrumbPage>
                            )}
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