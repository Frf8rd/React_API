
import { useState } from "react";
import { getCatImageUrl } from "../api/httpCatApi";
import { useApiRequest } from "../hooks/useApiRequest";

export default function CatStatusViewer() {
  const [code, setCode] = useState("");
  const { data: imageUrl, loading, error, execute } = useApiRequest();

  const handleSubmit = (e) => {
    e.preventDefault();
    execute(getCatImageUrl, code);
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", fontFamily: "sans-serif", textAlign: "center" }}>
      <h2>HTTP Cat Viewer</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ex: 404, 200, 418..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Se verifică..." : "Arată pisica"}
        </button>
      </form>

      {loading && <p>Se verifică dacă există imagine pentru acest cod...</p>}

      {!loading && error && (
        <div style={{ color: "crimson", marginTop: 12 }}>
          {error.status === 400 && <p> {error.message}</p>}
          {error.status === 404 && <p> {error.message}</p>}
          {error.status === null && <p> {error.message}</p>}
          {error.status && ![400, 404].includes(error.status) && (
            <p> {error.message}</p>
          )}
        </div>
      )}

      {!loading && !error && imageUrl && (
        <div style={{ marginTop: 12 }}>
          <img
            src={imageUrl}
            alt={`Pisică pentru codul HTTP ${code}`}
            style={{ maxWidth: "100%", borderRadius: 8 }}
          />
        </div>
      )}
    </div>
  );
}