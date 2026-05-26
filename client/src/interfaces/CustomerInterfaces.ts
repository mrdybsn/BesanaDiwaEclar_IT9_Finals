export interface CustomerColumns {
    customer_id:     number;
    first_name:      string;
    middle_name?:    string | null;
    last_name:       string;
    suffix_name?:    string | null;
    gender?:         "male" | "female" | "prefer_not_to_say" | null;
    birth_date?:     string | null;
    age?:            number | null;
    contact_number?: string | null;
    address?:        string | null;
    username?:       string | null;
    is_active:       boolean;
    is_deleted:      boolean;
    created_at:      string;
    updated_at:      string;
}

export interface CustomerPagination {
    data:         CustomerColumns[];
    current_page: number;
    last_page:    number;
    per_page:     number;
    total:        number;
}

export interface CustomerFieldErrors {
    first_name?:            string[];
    middle_name?:           string[];
    last_name?:             string[];
    suffix_name?:           string[];
    gender?:                string[];
    birth_date?:            string[];
    contact_number?:        string[];
    address?:               string[];
    username?:              string[];
    password?:              string[];
    password_confirmation?: string[];
}