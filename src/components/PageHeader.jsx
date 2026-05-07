// src/components/PageHeader.jsx
import React from 'react';

export default function PageHeader({ title, breadcrumb, children }) {
    return (
        <div className="flex items-center justify-between px-8 py-6">
            <div className="flex flex-col">
                <h1 className="text-4xl font-bold text-gray-800 tracking-tight">{title}</h1>
                <div className="flex items-center mt-2 text-sm font-medium text-gray-400">
                    {/* Cek apakah breadcrumb string atau array */}
                    {Array.isArray(breadcrumb) ? (
                        breadcrumb.map((item, index) => (
                            <React.Fragment key={index}>
                                <span>{item}</span>
                                {index < breadcrumb.length - 1 && <span className="mx-2 text-gray-300">/</span>}
                            </React.Fragment>
                        ))
                    ) : (
                        <span>{breadcrumb}</span>
                    )}
                </div>
            </div>

            {/* Children di sini akan berisi tombol "Add New" dari masing-masing halaman */}
            <div className="flex items-center">
                {children}
            </div>
        </div>
    );
}