export interface CreateOrganizationDto {
    name: string;
    address: string;
    owner_id: string;
}

export interface UpdateMyOrganizationDto {
    name: string;
    address?: string;
}

export interface Organization {
    id: string;
    name: string;
    address: string;
    owner_id: string;
    created_at?: string;
    updated_at?: string;
    is_active?: boolean;
}

export interface OrganizationSearchParams {
    searchKey?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface OrganizationListResponse {
    statusCode: number;
    message: string;
    data: {
        data: Organization[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface OrganizationResponse {
    statusCode: number;
    message: string;
    data: Organization;
}
