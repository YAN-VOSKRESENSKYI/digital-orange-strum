import { useNavigate } from "react-router";

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 13.9918 13.9918" fill="none">
      <path d="M11.0768 6.9959H2.91496" stroke="#999999" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16598" />
      <path d="M6.9959 2.91496L2.91496 6.9959L6.9959 11.0768" stroke="#999999" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16598" />
    </svg>
  );
}

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: "#0d0d0d",
        minHeight: "100vh",
        width: "100%",
        padding: "20px",
        fontFamily: "'Manrope', sans-serif",
        color: "#fff",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative" }}>
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-[8px]"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1.076px solid rgba(255,85,0,0.18)",
            borderRadius: 12,
            height: 37,
            padding: "0 14px 0 10px",
            cursor: "pointer",
            marginBottom: "30px",
          }}
        >
          <ArrowLeftIcon />
          <span style={{ fontWeight: 500, fontSize: 13, color: "#999", lineHeight: "19.5px" }}>
            Назад
          </span>
        </button>

        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Політика конфіденційності</h1>
        <div style={{ lineHeight: "1.6", color: "#ccc", whiteSpace: "pre-wrap" }}>
          (Текст політики конфіденційності буде розміщено тут)
          <br /><br />
          Будь ласка, надайте актуальний текст політики конфіденційності.
        </div>
      </div>
    </div>
  );
}
