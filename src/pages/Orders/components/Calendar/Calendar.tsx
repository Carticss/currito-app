import React, { useState } from 'react';

interface CalendarProps {
    onSelectRange: (start: Date, end: Date) => void;
    onClose: () => void;
}

export const Calendar: React.FC<CalendarProps> = ({ onSelectRange, onClose }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

        if (!startDate || (startDate && endDate)) {
            setStartDate(clickedDate);
            setEndDate(null);
        } else {
            if (clickedDate < startDate) {
                setStartDate(clickedDate);
                setEndDate(startDate);
                onSelectRange(clickedDate, startDate);
            } else {
                setEndDate(clickedDate);
                onSelectRange(startDate, clickedDate);
            }
        }
    };

    const renderDays = () => {
        const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
        const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            let className = 'calendar-day';

            if (startDate && date.getTime() === startDate.getTime()) className += ' selected start';
            if (endDate && date.getTime() === endDate.getTime()) className += ' selected end';
            if (startDate && endDate && date > startDate && date < endDate) className += ' in-range';

            days.push(
                <div key={i} className={className} onClick={() => handleDateClick(i)}>
                    {i}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="calendar-popup">
            <div className="calendar-header">
                <button onClick={handlePrevMonth}>&lt;</button>
                <span>{currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                <button onClick={handleNextMonth}>&gt;</button>
            </div>
            <div className="calendar-grid">
                <div className="day-name">Do</div>
                <div className="day-name">Lu</div>
                <div className="day-name">Ma</div>
                <div className="day-name">Mi</div>
                <div className="day-name">Ju</div>
                <div className="day-name">Vi</div>
                <div className="day-name">Sa</div>
                {renderDays()}
            </div>
            <div className="calendar-footer">
                <button className="calendar-close-btn" onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};
