export interface InventoryTransactionItem {
    id: string;
    transaction_id: string;
    ticket_id: string;
    quantity: number;
    price: number;
    created_at?: string;
    updated_at?: string;
}

export interface InventoryTransactionItemSearchParams {
    searchKey?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    type?: 'import' | 'export';
    sub_type?: 'buy_from_agent' | 'return_from_seller' | 'buy_from_partner' | 'exchange_ticket' | 'return_to_agent' | 'sell_to_seller' | 'sell_to_customer' | 'sell_to_online';
    partner_id?: string;
}

export interface InventoryTransactionItemListResponse {
    statusCode: number;
    message: string;
    data: {
        data: InventoryTransactionItem[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface InventoryTransactionItemResponse {
    statusCode: number;
    message: string;
    data: InventoryTransactionItem;
}
