import { useState, useRef, useEffect } from "react";


export const useCustomSelect = (
    {
        value,
        options,
        onChange
    }: {
        value: string;
        options: { value: string; label: string }[];
        onChange: (value: string) => void;
    }
) => {

    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleOptionClick = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return {
        isOpen,
        setIsOpen,
        containerRef,
        selectedOption,
        handleOptionClick
    };
}