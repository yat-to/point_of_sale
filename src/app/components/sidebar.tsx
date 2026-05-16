"use client";
import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { useRouter } from 'next/navigation';

import { menu } from '../../data/menu';
import { MenuItem } from '../../types';

const ListMenu = ({ item }: { item: MenuItem }) => {
    const router = useRouter(); // Pastikan router dipanggil di sini juga
    const hasChildren = (item.children ?? []).length > 0;
    const [isOpen, setIsOpen] = useState(false)
    const DynamicIcon = item.icon ? LucideIcons[item.icon as keyof typeof LucideIcons] as React.ElementType : null;
    const ChevronIcon = LucideIcons['ChevronDown'];

    const handleClick = () => {
        if (hasChildren) {
            // Jika punya anak, buka/tutup dropdown
            setIsOpen(!isOpen);
        } else {
            // Jika TIDAK punya anak, pindah ke URL-nya
            if (item.url) {
                router.push(item.url);
            }
        }
    };

    return (
        <li className="list-none">
            <div
                onClick={handleClick}
                className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 cursor-pointer transition-colors"
            >
                <div className="flex items-center gap-4">
                    {DynamicIcon ? <DynamicIcon size={20} /> : " "}
                    <span>{item.title}</span>
                </div>

                {hasChildren && (
                    <span className={`text-[10px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronIcon />
                    </span>
                )}
            </div>

            {hasChildren && (
                <div
                    className={`grid transition-all duration-300 ease-in-out ${
                        isOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
                    }`}
                >
                    <ul className="overflow-hidden ml-9 border-l border-gray-200 flex flex-col gap-1">
                        {item.children?.map((child: MenuItem) => (
                            <ListMenu key={child.title} item={child} />
                        ))}
                    </ul>
                </div>
            )}
        </li>
    )
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
    return (
        <div>
            {isOpen && (
                <div
                    className='fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity'
                    onClick={onClose}
                />
            )}
            {/* <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col sticky top-0"> */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col 
                transition-transform duration-300 ease-in-out

                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Brand Logo Section */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            AP
                        </div>
                        <span className="text-xl font-bold text-gray-800">APP POS</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 space-y-1">
                    {
                        menu.map((item) => (
                            <ListMenu key={item.title} item={item} />
                        ))
                    }
                </nav>
            </aside>
        </div>
    )
}

export default Sidebar