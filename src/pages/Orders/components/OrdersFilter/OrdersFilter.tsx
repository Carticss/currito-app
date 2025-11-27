import React, { useRef, useEffect } from 'react';
import { CustomSelect } from '../../../../components/CustomSelect/CustomSelect';
import { Calendar } from '../Calendar/Calendar';
import type { OrdersFilterProps } from '../../types/types';
import { DATE_OPTIONS, STATUS_OPTIONS } from '../../constants/constants';

export const OrdersFilter: React.FC<OrdersFilterProps> = ({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    onDateRangeSelect,
    showCalendar,
    setShowCalendar
}) => {

    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleDateChange = (value: string) => {
        setDateFilter(value);
        setShowCalendar(value === 'Personalizado');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowCalendar(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="orders-filter" ref={wrapperRef}>
            <div className="search-bar">
                <span className="search-icon">
                    <img src="search-icon.svg" alt="Search" />
                </span>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar por cliente, ID de pedido o teléfono..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <CustomSelect
                value={dateFilter}
                onChange={handleDateChange}
                options={DATE_OPTIONS}
                className="filter-select-custom"
            />

            {showCalendar && (
                <div className="calendar-wrapper">
                    <Calendar
                        onSelectRange={onDateRangeSelect}
                        onClose={() => setShowCalendar(false)}
                    />
                </div>
            )}

            <CustomSelect
                value={statusFilter}
                onChange={setStatusFilter}
                options={STATUS_OPTIONS}
                className="filter-select-custom"
            />
        </div>
    );
};
