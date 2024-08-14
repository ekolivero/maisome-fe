import MultiSelectInput from "@/components/ui/multi-select";
import { components } from "@/app/types/schema";

export type FilterProps = {
    location: components["schemas"]["Location"];
}

export default function SmartFilter({ location }: FilterProps) {
    return (
        <>
        <div
            className={"sticky top-0"}
        >
            <div className={`bg-white dark:bg-black transition-all duration-300 ease-in-out`}>
                <div className="bg-white shadow-lg px-4 py-2">
                    <MultiSelectInput location={location} />
                </div>
            </div>
        </div>
        </>
    )
}