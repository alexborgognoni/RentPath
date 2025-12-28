/**
 * State/Province data for countries that require or commonly use administrative divisions.
 */

export interface StateProvinceOption {
    code: string;
    name: string;
}

/**
 * Countries where state/province is REQUIRED for addresses.
 *
 * IMPORTANT: This list MUST match the backend list in:
 * app/Http/Requests/StoreApplicationRequest.php (search for $countriesRequiringState)
 *
 * Per DESIGN.md validation strategy, frontend and backend must have identical
 * validation logic. When adding/modifying countries, update BOTH files.
 */
export const COUNTRIES_REQUIRING_STATE: string[] = ['US', 'CA', 'AU', 'BR', 'MX', 'IN'];

/**
 * Countries where state/province is OPTIONAL but commonly used.
 */
export const COUNTRIES_WITH_OPTIONAL_STATE: string[] = ['DE', 'IT', 'ES', 'CH', 'GB', 'NL', 'FR'];

/**
 * State/Province options by country code.
 */
export const STATE_PROVINCE_OPTIONS: Record<string, StateProvinceOption[]> = {
    US: [
        { code: 'AL', name: 'Alabama' },
        { code: 'AK', name: 'Alaska' },
        { code: 'AZ', name: 'Arizona' },
        { code: 'AR', name: 'Arkansas' },
        { code: 'CA', name: 'California' },
        { code: 'CO', name: 'Colorado' },
        { code: 'CT', name: 'Connecticut' },
        { code: 'DE', name: 'Delaware' },
        { code: 'DC', name: 'District of Columbia' },
        { code: 'FL', name: 'Florida' },
        { code: 'GA', name: 'Georgia' },
        { code: 'HI', name: 'Hawaii' },
        { code: 'ID', name: 'Idaho' },
        { code: 'IL', name: 'Illinois' },
        { code: 'IN', name: 'Indiana' },
        { code: 'IA', name: 'Iowa' },
        { code: 'KS', name: 'Kansas' },
        { code: 'KY', name: 'Kentucky' },
        { code: 'LA', name: 'Louisiana' },
        { code: 'ME', name: 'Maine' },
        { code: 'MD', name: 'Maryland' },
        { code: 'MA', name: 'Massachusetts' },
        { code: 'MI', name: 'Michigan' },
        { code: 'MN', name: 'Minnesota' },
        { code: 'MS', name: 'Mississippi' },
        { code: 'MO', name: 'Missouri' },
        { code: 'MT', name: 'Montana' },
        { code: 'NE', name: 'Nebraska' },
        { code: 'NV', name: 'Nevada' },
        { code: 'NH', name: 'New Hampshire' },
        { code: 'NJ', name: 'New Jersey' },
        { code: 'NM', name: 'New Mexico' },
        { code: 'NY', name: 'New York' },
        { code: 'NC', name: 'North Carolina' },
        { code: 'ND', name: 'North Dakota' },
        { code: 'OH', name: 'Ohio' },
        { code: 'OK', name: 'Oklahoma' },
        { code: 'OR', name: 'Oregon' },
        { code: 'PA', name: 'Pennsylvania' },
        { code: 'RI', name: 'Rhode Island' },
        { code: 'SC', name: 'South Carolina' },
        { code: 'SD', name: 'South Dakota' },
        { code: 'TN', name: 'Tennessee' },
        { code: 'TX', name: 'Texas' },
        { code: 'UT', name: 'Utah' },
        { code: 'VT', name: 'Vermont' },
        { code: 'VA', name: 'Virginia' },
        { code: 'WA', name: 'Washington' },
        { code: 'WV', name: 'West Virginia' },
        { code: 'WI', name: 'Wisconsin' },
        { code: 'WY', name: 'Wyoming' },
        // Territories
        { code: 'AS', name: 'American Samoa' },
        { code: 'GU', name: 'Guam' },
        { code: 'MP', name: 'Northern Mariana Islands' },
        { code: 'PR', name: 'Puerto Rico' },
        { code: 'VI', name: 'U.S. Virgin Islands' },
    ],
    CA: [
        { code: 'AB', name: 'Alberta' },
        { code: 'BC', name: 'British Columbia' },
        { code: 'MB', name: 'Manitoba' },
        { code: 'NB', name: 'New Brunswick' },
        { code: 'NL', name: 'Newfoundland and Labrador' },
        { code: 'NS', name: 'Nova Scotia' },
        { code: 'NT', name: 'Northwest Territories' },
        { code: 'NU', name: 'Nunavut' },
        { code: 'ON', name: 'Ontario' },
        { code: 'PE', name: 'Prince Edward Island' },
        { code: 'QC', name: 'Quebec' },
        { code: 'SK', name: 'Saskatchewan' },
        { code: 'YT', name: 'Yukon' },
    ],
    AU: [
        { code: 'ACT', name: 'Australian Capital Territory' },
        { code: 'NSW', name: 'New South Wales' },
        { code: 'NT', name: 'Northern Territory' },
        { code: 'QLD', name: 'Queensland' },
        { code: 'SA', name: 'South Australia' },
        { code: 'TAS', name: 'Tasmania' },
        { code: 'VIC', name: 'Victoria' },
        { code: 'WA', name: 'Western Australia' },
    ],
    BR: [
        { code: 'AC', name: 'Acre' },
        { code: 'AL', name: 'Alagoas' },
        { code: 'AP', name: 'Amapa' },
        { code: 'AM', name: 'Amazonas' },
        { code: 'BA', name: 'Bahia' },
        { code: 'CE', name: 'Ceara' },
        { code: 'DF', name: 'Distrito Federal' },
        { code: 'ES', name: 'Espirito Santo' },
        { code: 'GO', name: 'Goias' },
        { code: 'MA', name: 'Maranhao' },
        { code: 'MT', name: 'Mato Grosso' },
        { code: 'MS', name: 'Mato Grosso do Sul' },
        { code: 'MG', name: 'Minas Gerais' },
        { code: 'PA', name: 'Para' },
        { code: 'PB', name: 'Paraiba' },
        { code: 'PR', name: 'Parana' },
        { code: 'PE', name: 'Pernambuco' },
        { code: 'PI', name: 'Piaui' },
        { code: 'RJ', name: 'Rio de Janeiro' },
        { code: 'RN', name: 'Rio Grande do Norte' },
        { code: 'RS', name: 'Rio Grande do Sul' },
        { code: 'RO', name: 'Rondonia' },
        { code: 'RR', name: 'Roraima' },
        { code: 'SC', name: 'Santa Catarina' },
        { code: 'SP', name: 'Sao Paulo' },
        { code: 'SE', name: 'Sergipe' },
        { code: 'TO', name: 'Tocantins' },
    ],
    MX: [
        { code: 'AGU', name: 'Aguascalientes' },
        { code: 'BCN', name: 'Baja California' },
        { code: 'BCS', name: 'Baja California Sur' },
        { code: 'CAM', name: 'Campeche' },
        { code: 'CHP', name: 'Chiapas' },
        { code: 'CHH', name: 'Chihuahua' },
        { code: 'CMX', name: 'Ciudad de Mexico' },
        { code: 'COA', name: 'Coahuila' },
        { code: 'COL', name: 'Colima' },
        { code: 'DUR', name: 'Durango' },
        { code: 'GUA', name: 'Guanajuato' },
        { code: 'GRO', name: 'Guerrero' },
        { code: 'HID', name: 'Hidalgo' },
        { code: 'JAL', name: 'Jalisco' },
        { code: 'MEX', name: 'Mexico' },
        { code: 'MIC', name: 'Michoacan' },
        { code: 'MOR', name: 'Morelos' },
        { code: 'NAY', name: 'Nayarit' },
        { code: 'NLE', name: 'Nuevo Leon' },
        { code: 'OAX', name: 'Oaxaca' },
        { code: 'PUE', name: 'Puebla' },
        { code: 'QUE', name: 'Queretaro' },
        { code: 'ROO', name: 'Quintana Roo' },
        { code: 'SLP', name: 'San Luis Potosi' },
        { code: 'SIN', name: 'Sinaloa' },
        { code: 'SON', name: 'Sonora' },
        { code: 'TAB', name: 'Tabasco' },
        { code: 'TAM', name: 'Tamaulipas' },
        { code: 'TLA', name: 'Tlaxcala' },
        { code: 'VER', name: 'Veracruz' },
        { code: 'YUC', name: 'Yucatan' },
        { code: 'ZAC', name: 'Zacatecas' },
    ],
    IN: [
        { code: 'AN', name: 'Andaman and Nicobar Islands' },
        { code: 'AP', name: 'Andhra Pradesh' },
        { code: 'AR', name: 'Arunachal Pradesh' },
        { code: 'AS', name: 'Assam' },
        { code: 'BR', name: 'Bihar' },
        { code: 'CH', name: 'Chandigarh' },
        { code: 'CT', name: 'Chhattisgarh' },
        { code: 'DN', name: 'Dadra and Nagar Haveli' },
        { code: 'DD', name: 'Daman and Diu' },
        { code: 'DL', name: 'Delhi' },
        { code: 'GA', name: 'Goa' },
        { code: 'GJ', name: 'Gujarat' },
        { code: 'HR', name: 'Haryana' },
        { code: 'HP', name: 'Himachal Pradesh' },
        { code: 'JK', name: 'Jammu and Kashmir' },
        { code: 'JH', name: 'Jharkhand' },
        { code: 'KA', name: 'Karnataka' },
        { code: 'KL', name: 'Kerala' },
        { code: 'LA', name: 'Ladakh' },
        { code: 'LD', name: 'Lakshadweep' },
        { code: 'MP', name: 'Madhya Pradesh' },
        { code: 'MH', name: 'Maharashtra' },
        { code: 'MN', name: 'Manipur' },
        { code: 'ML', name: 'Meghalaya' },
        { code: 'MZ', name: 'Mizoram' },
        { code: 'NL', name: 'Nagaland' },
        { code: 'OR', name: 'Odisha' },
        { code: 'PY', name: 'Puducherry' },
        { code: 'PB', name: 'Punjab' },
        { code: 'RJ', name: 'Rajasthan' },
        { code: 'SK', name: 'Sikkim' },
        { code: 'TN', name: 'Tamil Nadu' },
        { code: 'TG', name: 'Telangana' },
        { code: 'TR', name: 'Tripura' },
        { code: 'UP', name: 'Uttar Pradesh' },
        { code: 'UT', name: 'Uttarakhand' },
        { code: 'WB', name: 'West Bengal' },
    ],
    // German Bundesländer (optional)
    DE: [
        { code: 'BW', name: 'Baden-Wurttemberg' },
        { code: 'BY', name: 'Bavaria' },
        { code: 'BE', name: 'Berlin' },
        { code: 'BB', name: 'Brandenburg' },
        { code: 'HB', name: 'Bremen' },
        { code: 'HH', name: 'Hamburg' },
        { code: 'HE', name: 'Hesse' },
        { code: 'MV', name: 'Mecklenburg-Vorpommern' },
        { code: 'NI', name: 'Lower Saxony' },
        { code: 'NW', name: 'North Rhine-Westphalia' },
        { code: 'RP', name: 'Rhineland-Palatinate' },
        { code: 'SL', name: 'Saarland' },
        { code: 'SN', name: 'Saxony' },
        { code: 'ST', name: 'Saxony-Anhalt' },
        { code: 'SH', name: 'Schleswig-Holstein' },
        { code: 'TH', name: 'Thuringia' },
    ],
    // Swiss Cantons (optional)
    CH: [
        { code: 'AG', name: 'Aargau' },
        { code: 'AR', name: 'Appenzell Ausserrhoden' },
        { code: 'AI', name: 'Appenzell Innerrhoden' },
        { code: 'BL', name: 'Basel-Landschaft' },
        { code: 'BS', name: 'Basel-Stadt' },
        { code: 'BE', name: 'Bern' },
        { code: 'FR', name: 'Fribourg' },
        { code: 'GE', name: 'Geneva' },
        { code: 'GL', name: 'Glarus' },
        { code: 'GR', name: 'Graubunden' },
        { code: 'JU', name: 'Jura' },
        { code: 'LU', name: 'Lucerne' },
        { code: 'NE', name: 'Neuchatel' },
        { code: 'NW', name: 'Nidwalden' },
        { code: 'OW', name: 'Obwalden' },
        { code: 'SG', name: 'St. Gallen' },
        { code: 'SH', name: 'Schaffhausen' },
        { code: 'SZ', name: 'Schwyz' },
        { code: 'SO', name: 'Solothurn' },
        { code: 'TG', name: 'Thurgau' },
        { code: 'TI', name: 'Ticino' },
        { code: 'UR', name: 'Uri' },
        { code: 'VS', name: 'Valais' },
        { code: 'VD', name: 'Vaud' },
        { code: 'ZG', name: 'Zug' },
        { code: 'ZH', name: 'Zurich' },
    ],
    // Netherlands provinces (optional)
    NL: [
        { code: 'DR', name: 'Drenthe' },
        { code: 'FL', name: 'Flevoland' },
        { code: 'FR', name: 'Friesland' },
        { code: 'GE', name: 'Gelderland' },
        { code: 'GR', name: 'Groningen' },
        { code: 'LI', name: 'Limburg' },
        { code: 'NB', name: 'North Brabant' },
        { code: 'NH', name: 'North Holland' },
        { code: 'OV', name: 'Overijssel' },
        { code: 'ZH', name: 'South Holland' },
        { code: 'UT', name: 'Utrecht' },
        { code: 'ZE', name: 'Zeeland' },
    ],
    // UK Countries (optional)
    GB: [
        { code: 'ENG', name: 'England' },
        { code: 'NIR', name: 'Northern Ireland' },
        { code: 'SCT', name: 'Scotland' },
        { code: 'WLS', name: 'Wales' },
    ],
};

/**
 * State/Province labels by country.
 */
export const STATE_PROVINCE_LABELS: Record<string, string> = {
    US: 'State',
    CA: 'Province',
    AU: 'State/Territory',
    BR: 'State',
    MX: 'State',
    IN: 'State/Territory',
    DE: 'Bundesland',
    CH: 'Canton',
    NL: 'Province',
    GB: 'Country',
    ES: 'Province',
    IT: 'Region',
    FR: 'Region',
};

/**
 * Check if a country requires state/province.
 */
export function requiresStateProvince(countryCode: string): boolean {
    return COUNTRIES_REQUIRING_STATE.includes(countryCode.toUpperCase());
}

/**
 * Check if a country has state/province options (required or optional).
 */
export function hasStateProvinceOptions(countryCode: string): boolean {
    return countryCode.toUpperCase() in STATE_PROVINCE_OPTIONS;
}

/**
 * Get state/province options for a country.
 */
export function getStateProvinceOptions(countryCode: string): StateProvinceOption[] {
    return STATE_PROVINCE_OPTIONS[countryCode.toUpperCase()] || [];
}

/**
 * Get the state/province label for a country.
 */
export function getStateProvinceLabel(countryCode: string): string {
    return STATE_PROVINCE_LABELS[countryCode.toUpperCase()] || 'State/Province';
}
