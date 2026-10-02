import { API_BASE_URL } from '../services/api';

function TopBar() {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Admissions portal</p>
        <h1>Student Admission System</h1>
      </div>
      <div className="topbar-badge">API: {API_BASE_URL}</div>
    </header>
  );
}

export default TopBar;
