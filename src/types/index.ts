export interface MenuItem {
    id?: string;
    title: string;
    url?: string;
    icon?: string;
    children?: MenuItem[];
}

export interface Kategori {
    id: string;
    uraian: string;
    createdAt: string;
    index: number;

}