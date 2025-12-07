import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();

    return (
        <nav style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '20px',
            padding: '15px',
            background: 'var(--bg-card)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
        }}>
            <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
                Dashboard
            </Link>
            <Link
                to="/test"
                className={`nav-link ${location.pathname === '/test' ? 'active' : ''}`}
            >
                Test (Debug)
            </Link>
        </nav>
    );
}
