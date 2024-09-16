export function getPriceDescription(min: number | null, max: number | null): string {
    if (min === null && max === null) {
        return "";
    } else if (min === 0 && max !== null) {
        if (max <= 100000) {
            return `economiche fino a ${max.toLocaleString()}€`;
        } else if (max <= 150000) {
            return `accessibili fino a ${max.toLocaleString()}€`;
        } else {
            return `fino a ${max.toLocaleString()}€`;
        }
    } else if (min !== null && min !== 0 && max === null) {
        if (min >= 1000000) {
            return `di lusso oltre ${min.toLocaleString()}€`;
        } else if (min >= 500000) {
            return `di pregio oltre ${min.toLocaleString()}€`;
        } else {
            return `oltre ${min.toLocaleString()}€`;
        }
    } else if (min !== null && max !== null) {
        if (max <= 100000) {
            return `economiche tra ${min.toLocaleString()}€ e ${max.toLocaleString()}€`;
        } else if (max <= 200000) {
            return `a prezzi medi tra ${min.toLocaleString()}€ e ${max.toLocaleString()}€`;
        } else if (min >= 1000000) {
            return `di lusso tra ${min.toLocaleString()}€ e ${max.toLocaleString()}€`;
        } else if (max >= 500000) {
            return `di pregio tra ${min.toLocaleString()}€ e ${max.toLocaleString()}€`;
        } else {
            return `tra ${min.toLocaleString()}€ e ${max.toLocaleString()}€`;
        }
    } else {
        return "";
    }
}