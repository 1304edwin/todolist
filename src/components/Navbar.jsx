function Navbar({ user, handleLogout }) {
  return (
    <div className="top-bar">
      <h2 className="logo">TaskFlow</h2>
      <div className="user-section">
        <p className="welcome-text">
          Bienvenido,<strong>{user?.username}</strong>{" "}
        </p>
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Navbar;
