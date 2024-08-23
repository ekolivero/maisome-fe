import { ReactNode } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, XIcon } from "lucide-react";

type FilterButtonProps = {
    label: string;
    children: ReactNode;
    onDelete?: () => void;
    showDeleteIcon?: boolean;
    open?: boolean;
    setOpen?: (open: boolean) => void;
};

export function FilterButton({ label, children, onDelete, showDeleteIcon, open, setOpen }: FilterButtonProps) {
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <div className="flex items-center">
                <PopoverTrigger asChild>
                    <Button size="lg" variant={"outline"} className="text-sm px-2 py-1 h-[58px] relative" onClick={() => setOpen && setOpen(!open)}>
                        {label}
                        {showDeleteIcon ? (
                            <XIcon
                                className="w-4 h-4 ml-2 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete && onDelete();
                                }}
                            />
                        ) : (
                            <ChevronDownIcon className="w-4 h-4 ml-2" />
                        )}
                    </Button>
                </PopoverTrigger>
            </div>
            <PopoverContent className="z-[1000000000000000]" align="start" side="bottom">
                {children}
            </PopoverContent>
        </Popover>
    );
}