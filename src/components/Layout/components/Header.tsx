interface HeaderProps {
    title: string;
    onMenuClick: () => void;
}

export const Header = ({ title, onMenuClick }: HeaderProps) => {
    return (
        <header className="main-header">
            <button className="menu-button" onClick={onMenuClick}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
            <h1 className="page-title">{title}</h1>
        </header>
    );
};
