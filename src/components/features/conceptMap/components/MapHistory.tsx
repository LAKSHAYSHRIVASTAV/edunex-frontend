import React, { useEffect } from "react";
import useConceptMapStore from "../hooks/useConceptMap";
import "./MapHistory.css";

/* ================= TIME FORMAT ================= */
function timeAgo(dateStr?: string) {
  if (!dateStr) return "—";

  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;

  return `${Math.floor(hrs / 24)}d ago`;
}

/* ================= TYPES ================= */
type MapHistoryProps = {
  userId: string;
  onSelect?: (map: any) => void;
};

export default function MapHistory({ userId, onSelect }: MapHistoryProps) {
  const {
    maps,
    loading,
    fetchMaps,
    setCurrentMap,
    deleteMap,
    currentMap,
  } = useConceptMapStore();

  /* ================= FETCH ================= */
  useEffect(() => {
    if (userId) {
      fetchMaps(userId);
    }
  }, [userId, fetchMaps]); // ✅ include fetchMaps

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="map-history">
        <div className="map-history__label">Recent Maps</div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="map-card skeleton" />
        ))}
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="map-history">
      <div className="map-history__label">
        Recent Maps ({maps?.length || 0})
      </div>

      {/* EMPTY STATE */}
      {(!maps || maps.length === 0) && (
        <div className="map-history__empty">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            style={{ opacity: 0.3 }}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M12 8v4M12 16h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <p>No maps yet. Generate one!</p>
        </div>
      )}

      {/* LIST */}
      <div className="map-card-list">
        {maps?.map((map: any) => (
          <div
            key={map._id}
            className={`map-card ${
              currentMap?._id === map._id ? "active" : ""
            }`}
            onClick={() => {
              setCurrentMap(map);
              onSelect && onSelect(map);
            }}
          >
            {/* TOP */}
            <div className="map-card__top">
              <span className="map-card__title">
                {map.title || "Untitled Map"}
              </span>

              <button
                className="map-card__delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMap(map._id);
                }}
                title="Delete"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* META */}
            <div className="map-card__meta">
              <span>{map.nodes?.length || 0} nodes</span>
              <span>·</span>
              <span>{map.edges?.length || 0} edges</span>
              <span>·</span>
              <span>{timeAgo(map.createdAt)}</span>
            </div>

            {/* TAGS */}
            {map.tags?.length > 0 && (
              <div className="map-card__tags">
                {map.tags.slice(0, 3).map((t: string) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
