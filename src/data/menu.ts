export const menu = [
    { id: '1', title: 'Dashboard', url: '/dashboard', icon: 'Home' },

    {
        id: '2',
        title: 'Kasir',
        url: '/kasir',
        icon: 'ShoppingCart'
    },

    {
        id: '3',
        title: 'Transaksi',
        url: '',
        icon: 'Receipt',
        children: [
            { title: 'Riwayat Transaksi', url: '/transaksi' },
        ]
    },

    {
        id: '4',
        title: 'Menu',
        url: '',
        icon: 'UtensilsCrossed',
        children: [
            { title: 'Data Menu', url: '/menu' },
            { title: 'Kategori', url: '/kategori' },
        ]
    },

    {
        id: '5',
        title: 'Laporan',
        url: '',
        icon: 'BarChart3',
        children: [
            { title: 'Laporan Penjualan', url: '/laporan' },
        ]
    },

    {
        id: '6',
        title: 'Pengaturan',
        url: '',
        icon: 'Settings',
        children: [
            { title: 'Pengguna', url: '/users' },
        ]
    },
];