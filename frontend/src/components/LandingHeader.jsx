import { NavLink } from "react-router-dom";

function LandingHeader() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 80px",
        background: "rgba(250, 250, 250, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}
    >
      <span
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "32px",
          color: "#0a0a0a",
          letterSpacing: "-0.01em",
        }}
      >
        HabitFlow
      </span>

      <nav style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <NavLink
          to="/signup"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "17px",
            fontWeight: 700,
            border: "1.5px solid #d1d1d1",
            padding: "10px 26px",
            borderRadius: "100px",
            color: "#0a0a0a",
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => (e.target.style.borderColor = "#0a0a0a")}
          onMouseLeave={(e) => (e.target.style.borderColor = "#d1d1d1")}
        >
          Sign Up
        </NavLink>

        <NavLink
          to="/login"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "17px",
            fontWeight: 700,
            background: "#0a0a0a",
            color: "#fafafa",
            border: "1.5px solid #0a0a0a",
            padding: "10px 26px",
            borderRadius: "100px",
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#333")}
          onMouseLeave={(e) => (e.target.style.background = "#0a0a0a")}
        >
          Log In
        </NavLink>
      </nav>
    </header>
  );
}

export default LandingHeader;
