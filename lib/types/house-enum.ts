import { notFound } from 'next/navigation';

type HouseTypeInfo = {
    singular: string;
    plural: string;
}

enum HouseType {
    MONOLOCALE = 'Monolocale',
    BILOCALE = 'Bilocale',
    TRILOCALE = 'Trilocale',
    QUADRILOCALE = 'Quadrilocale',
    APPARTAMENTO = 'Appartamento',
    LOFT = 'Loft',
    TERRATETTO = 'Terratetto',
    VILLA = 'Villa',
    VILLA_BIFAMILIARE = 'Villa bifamiliare',
    VILLA_SCHIERA = 'Villa a schiera',
    CASA_INDIPENDENTE = 'Casa indipendente',
    RUSTICO = 'Rustico',
    CASE = 'Case'
}

const houseTypeInfo: { [key in HouseType]: HouseTypeInfo } = {
    [HouseType.MONOLOCALE]: { singular: 'Monolocale', plural: 'Monolocali' },
    [HouseType.BILOCALE]: { singular: 'Bilocale', plural: 'Bilocali' },
    [HouseType.TRILOCALE]: { singular: 'Trilocale', plural: 'Trilocali' },
    [HouseType.QUADRILOCALE]: { singular: 'Quadrilocale', plural: 'Quadrilocali' },
    [HouseType.APPARTAMENTO]: { singular: 'Appartamento', plural: 'Appartamenti' },
    [HouseType.LOFT]: { singular: 'Loft', plural: 'Loft' },
    [HouseType.TERRATETTO]: { singular: 'Terratetto', plural: 'Terratetti' },
    [HouseType.VILLA]: { singular: 'Villa', plural: 'Ville' },
    [HouseType.VILLA_BIFAMILIARE]: { singular: 'Villa bifamiliare', plural: 'Ville bifamiliari' },
    [HouseType.VILLA_SCHIERA]: { singular: 'Villa a schiera', plural: 'Ville a schiera' },
    [HouseType.CASA_INDIPENDENTE]: { singular: 'Casa indipendente', plural: 'Case indipendenti' },
    [HouseType.RUSTICO]: { singular: 'Rustico', plural: 'Rustici' },
    [HouseType.CASE]: { singular: 'Case', plural: 'Case' },
};

function getHouseTypeFromString(input: string): HouseTypeInfo {
    const normalizedInput = input.toLowerCase();
    
    const houseTypeMap: { [key: string]: HouseType } = {
        'vendita-monolocale': HouseType.MONOLOCALE,
        'vendita-bilocale': HouseType.BILOCALE,
        'vendita-trilocale': HouseType.TRILOCALE,
        'vendita-quadrilocale': HouseType.QUADRILOCALE,
        'vendita-appartamento': HouseType.APPARTAMENTO,
        'vendita-loft': HouseType.LOFT,
        'vendita-terratetto': HouseType.TERRATETTO,
        'vendita-villa': HouseType.VILLA,
        'vendita-villa-bifamiliare': HouseType.VILLA_BIFAMILIARE,
        'vendita-villa-a-schiera': HouseType.VILLA_SCHIERA,
        'vendita-casa-indipendente': HouseType.CASA_INDIPENDENTE,
        'vendita-rustico': HouseType.RUSTICO,
        'vendita-case': HouseType.CASE,
    };

    const houseType = houseTypeMap[normalizedInput];
    
    if (houseType) {
        return houseTypeInfo[houseType];
    } else {
        notFound();
    }
}

export { HouseType };
export type { HouseTypeInfo };
export { getHouseTypeFromString };

