import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface StatCardsProps {
  title: string;
  value: number;
  trend: string;
  variant: "primary" | "info";
  icon: "book" | "people";
  loading?: boolean;
}

const iconMap = {
  book: "📚",
  people: "👨‍🎓",
};

const variantColor = {
  primary: "#3b6ef5",
  info: "#0aa8c0",
};

const StatCards: React.FC<StatCardsProps> = ({
  title,
  value,
  trend,
  variant,
  icon,
  loading = false,
}) => {
  return (
    <SkeletonTheme baseColor="#ede9e1" highlightColor="#f5f2ee">
      <div
        style={{
          background: "#fff",
          border: "1px solid #e4e0d8",
          borderRadius: 16,
          padding: "1.2rem 1.4rem",
          boxShadow: "0 2px 12px rgba(60,50,30,0.06)",
          height: "100%",
          transition: "transform 0.18s ease, box-shadow 0.18s ease",
          cursor: "default",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform =
            "translateY(-2px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 6px 20px rgba(60,50,30,0.1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 2px 12px rgba(60,50,30,0.06)";
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            {/* Icon */}
            <div style={{ fontSize: 28, marginBottom: 10 }}>
              {loading ? (
                <Skeleton width={36} height={36} borderRadius={10} />
              ) : (
                iconMap[icon]
              )}
            </div>

            {/* Value */}
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#1e1c19",
                fontFamily: "DM Mono, monospace",
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {loading ? (
                <Skeleton width={60} height={28} borderRadius={6} />
              ) : (
                value
              )}
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#7a7167",
                fontFamily: "DM Mono, monospace",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {loading ? (
                <Skeleton width={90} height={10} borderRadius={4} />
              ) : (
                title
              )}
            </div>
          </div>

          {/* Trend badge */}
          {loading ? (
            <Skeleton width={60} height={26} borderRadius={20} />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "#edfaf4",
                border: "1px solid #a3e6c5",
                color: "#16a85a",
                borderRadius: 20,
                padding: "4px 10px",
                fontSize: 11,
                fontFamily: "DM Mono, monospace",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              ↑ {trend}
            </div>
          )}
        </div>

        {/* Bottom accent bar */}
        {!loading && (
          <div
            style={{
              marginTop: 16,
              height: 3,
              borderRadius: 2,
              background: `linear-gradient(90deg, ${variantColor[variant]}33, ${variantColor[variant]})`,
            }}
          />
        )}
        {loading && (
          <Skeleton height={3} borderRadius={2} style={{ marginTop: 16 }} />
        )}
      </div>
    </SkeletonTheme>
  );
};

export default StatCards;
