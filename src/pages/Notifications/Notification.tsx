import { useState } from "react";
import {
  NoticeFilter,
  SingleNotice,
  SingleNoticeStatus,
  NoticeUserType,
  NoticeCounts,
} from "../../features/admin/management/utils";
import {
  useGetNotificationQuery,
  useMarkAsReadNoticeMutation,
} from "../../features/admin/management/mamagementApi";
import { useAppSelector } from "../../app/hooks";
import toast from "react-hot-toast";
import { getRoleByType } from "../../helper";
import { RootState } from "../../app/store";

type FilterPill = "all" | "unread" | "admin" | "teacher" | "student";

interface TypeConfig {
  emoji: string;
  bg: string;
  color: string;
}

const TYPE_CONFIG: Record<NoticeUserType, TypeConfig> = {
  [NoticeUserType.ADMIN]: { emoji: "🏫", bg: "#e0f2fe", color: "#0369a1" },
  [NoticeUserType.TEACHER]: { emoji: "👨‍🏫", bg: "#f3e8ff", color: "#7e22ce" },
  [NoticeUserType.STUDENT]: { emoji: "📢", bg: "#fef9c3", color: "#854d0e" },
};

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const formatTime = (iso: string): string => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 172800) return "Yesterday";
  return `${Math.floor(diff / 86400)} days ago`;
};

const SkeletonCard = () => (
  <div
    style={{
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      padding: "13px 15px",
      display: "flex",
      gap: "12px",
    }}
  >
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: "10px",
        background: "#f1f5f9",
        flexShrink: 0,
      }}
    />
    <div style={{ flex: 1 }}>
      <div
        style={{
          height: 14,
          width: "60%",
          background: "#f1f5f9",
          borderRadius: 6,
          marginBottom: 8,
        }}
      />
      <div
        style={{
          height: 12,
          width: "40%",
          background: "#f1f5f9",
          borderRadius: 6,
          marginBottom: 8,
        }}
      />
      <div
        style={{
          height: 12,
          width: "80%",
          background: "#f1f5f9",
          borderRadius: 6,
        }}
      />
    </div>
  </div>
);

const NotificationsPage: React.FC = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const userRole = user?.UserType?.toLowerCase();

  const [activeFilter, setActiveFilter] = useState<FilterPill>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, isFetching, refetch } = useGetNotificationQuery({
    page,
    limit,
    filter: activeFilter === "all" ? undefined : (activeFilter as NoticeFilter),
  });

  const [markAsRead, { isLoading: isMarking }] = useMarkAsReadNoticeMutation();

  const notices: SingleNotice[] = data?.data ?? [];
  const counts: NoticeCounts = data?.counts ?? {
    all: 0,
    unread: 0,
    admin: 0,
    teacher: 0,
    student:0,
  };
  const lastPage: number = data?.lastPage ?? 1;

  /* ── Handlers ── */
  const handleNoticeClick = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleMarkSingleRead = async (e: React.MouseEvent, n: SingleNotice) => {
    e.stopPropagation();
    try {
      const response = await markAsRead({ id: n.id }).unwrap();
      if (response.success) {
        toast.success(response.message);
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Faile to mark as ready";
      toast.error(errorMessage);
    }
  };

  const handleMarkAllRead = async () => {
    // type: "A" for admin filter, "T" for teacher filter, omit for all/unread
    const payload: { all: boolean; type?: "A" | "T" } = {
      all: true,
    };
    if (activeFilter === "admin") payload.type = "A";
    if (activeFilter === "teacher") payload.type = "T";

    try {
      const response = await markAsRead(payload).unwrap();
      if(response.success){
        toast.success(response.message);
      }
    } catch (error:any) {
      const errorMessage = error?.data.message || "Failed to mark as read";
      toast.error(errorMessage);
    }
  };

  const handleFilterChange = (key: FilterPill) => {
    setActiveFilter(key);
    setPage(1);
  };

  /* ── Group by date ── */
  const grouped = notices.reduce<Record<string, SingleNotice[]>>((acc, n) => {
    const label = formatDate(n.createdAt);
    (acc[label] = acc[label] || []).push(n);
    return acc;
  }, {});

  const groupEntries = Object.entries(grouped).sort(
    ([, a], [, b]) =>
      new Date(b[0].createdAt).getTime() - new Date(a[0].createdAt).getTime(),
  );

  /* ── Pills ── */
  const pills: {
    key: FilterPill;
    label: string;
    emoji: string;
    count: number;
  }[] = [
    { key: "all", label: "All", emoji: "🔔", count: counts.all },
    { key: "unread", label: "Unread", emoji: "🔵", count: counts.unread },
    { key: "admin", label: "Admin", emoji: "🏫", count: counts.admin },
    { key: "teacher", label: "Teachers", emoji: "👨‍🏫", count: counts.teacher },
    {key:"student",label:"Student",emoji:"🧑‍🎓",count:counts.student}
  ];

  return (
    <div
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        padding: "24px 28px",
      }}
    >
      <div style={{ width: "100%" }}>
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "22px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                background: "#e0f2fe",
                borderRadius: "10px",
                width: 38,
                height: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              🔔
            </div>
            <div>
              <h4
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: "21px",
                  color: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Notifications
                {counts.unread > 0 && (
                  <span
                    style={{
                      background: "#0369a1",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "3px 9px",
                      borderRadius: "999px",
                    }}
                  >
                    {counts.unread} new
                  </span>
                )}
              </h4>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#64748b" }}>
                Messages, notices and system alerts
              </p>
            </div>
          </div>

          {/* Header actions */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {counts.unread > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={isMarking || isFetching}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#fff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  padding: "7px 14px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#475569",
                  cursor: isMarking ? "not-allowed" : "pointer",
                  opacity: isMarking ? 0.6 : 1,
                }}
              >
                ✓✓ Mark all as read
                {/* label changes based on active filter */}
                {activeFilter === "admin" && " (Admin)"}
                {activeFilter === "teacher" && " (Teachers)"}
              </button>
            )}
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "#fff",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                padding: "7px 14px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#475569",
                cursor: isFetching ? "not-allowed" : "pointer",
                opacity: isFetching ? 0.6 : 1,
              }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* ── Filter pills ── */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          {pills
            .map((pill) => {
              const active = activeFilter === pill.key;
              return (
                <button
                  key={pill.key}
                  onClick={() => handleFilterChange(pill.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    border: active
                      ? "1.5px solid #0369a1"
                      : "1.5px solid #e2e8f0",
                    background: active ? "#e0f2fe" : "#fff",
                    color: active ? "#0369a1" : "#64748b",
                    fontWeight: active ? 700 : 500,
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "all 0.12s ease",
                    boxShadow: active
                      ? "0 0 0 3px rgba(3,105,161,0.1)"
                      : "none",
                    opacity: isFetching ? 0.6 : 1,
                  }}
                >
                  <span style={{ fontSize: "13px" }}>{pill.emoji}</span>
                  {pill.label}
                  {pill.count > 0 && (
                    <span
                      style={{
                        background: active ? "#0369a1" : "#f1f5f9",
                        color: active ? "#fff" : "#64748b",
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "1px 7px",
                        borderRadius: "999px",
                      }}
                    >
                      {pill.count}
                    </span>
                  )}
                </button>
              );
            })
            .filter((pill) => {
              if (getRoleByType(userRole) === "teacher") {
                return pill.key !== "teacher" && pill.key !== "admin" && pill.key !=="student";
              }else if(getRoleByType(userRole)==="admin" || getRoleByType(userRole) === "superadmin"){
                return pill.key !== "admin";
              }else if(getRoleByType(userRole)==="student"){
                return pill.key !=="student";
              }
              return true;
            })}
        </div>

        {/* ── Loading skeleton ── */}
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : /* ── Empty state ── */
        groupEntries.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 24px",
              background: "#fff",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔕</div>
            <div
              style={{
                fontWeight: 600,
                fontSize: "15px",
                color: "#374151",
                marginBottom: 4,
              }}
            >
              No notifications
            </div>
            <div style={{ fontSize: "13.5px", color: "#9ca3af" }}>
              {activeFilter === "all"
                ? "You're all caught up!"
                : `No ${activeFilter} notifications`}
            </div>
          </div>
        ) : (
          /* ── Notification list ── */
          <>
            {groupEntries.map(([date, items]) => (
              <div key={date} style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    marginBottom: "8px",
                    paddingLeft: "2px",
                  }}
                >
                  {date}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {items.map((n) => {
                    const expanded = expandedId === n.id;
                    const isUnread = n.status === SingleNoticeStatus.UNREAD;
                    const cfg =
                      TYPE_CONFIG[n.publisherType] ??
                      TYPE_CONFIG[NoticeUserType.ADMIN];

                    return (
                      <div
                        key={n.id}
                        onClick={() => handleNoticeClick(n.id)}
                        style={{
                          background: isUnread ? "#f0f9ff" : "#fff",
                          border: `1px solid ${isUnread ? "#bae6fd" : "#e2e8f0"}`,
                          borderRadius: "12px",
                          padding: "13px 15px",
                          cursor: "pointer",
                          boxShadow: expanded
                            ? "0 4px 16px rgba(0,0,0,0.07)"
                            : "none",
                          transition: "box-shadow 0.15s",
                          opacity: isFetching ? 0.7 : 1,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "flex-start",
                          }}
                        >
                          {/* Icon */}
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: "10px",
                              background: isUnread ? cfg.bg : "#f1f5f9",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "16px",
                              flexShrink: 0,
                            }}
                          >
                            {"🔔"}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            {/* Title row */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                gap: "8px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "7px",
                                  flexWrap: "wrap",
                                }}
                              >
                                {isUnread && (
                                  <span
                                    style={{
                                      width: 7,
                                      height: 7,
                                      borderRadius: "50%",
                                      background: "#0369a1",
                                      display: "inline-block",
                                      flexShrink: 0,
                                    }}
                                  />
                                )}
                                <span
                                  style={{
                                    fontWeight: isUnread ? 700 : 500,
                                    fontSize: "14.5px",
                                    color: "#0f172a",
                                  }}
                                >
                                  {n.subject}
                                </span>
                                <span
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    padding: "2px 8px",
                                    borderRadius: "999px",
                                    background: cfg.bg,
                                    color: cfg.color,
                                  }}
                                >
                                  {n.publisherType === NoticeUserType.ADMIN
                                    ? "Admin"
                                    : "Teacher"}
                                </span>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  flexShrink: 0,
                                }}
                              >
                                {isUnread && (
                                  <button
                                    onClick={(e) => handleMarkSingleRead(e, n)}
                                    disabled={isMarking}
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "4px",
                                      padding: "3px 10px",
                                      borderRadius: "999px",
                                      border: "1px solid #bae6fd",
                                      background: "#e0f2fe",
                                      color: "#0369a1",
                                      fontSize: "11px",
                                      fontWeight: 600,
                                      cursor: isMarking
                                        ? "not-allowed"
                                        : "pointer",
                                      opacity: isMarking ? 0.6 : 1,
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    ✓ Mark as read
                                  </button>
                                )}
                                <span
                                  style={{
                                    fontSize: "12px",
                                    color: "#94a3b8",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {formatTime(n.createdAt)}
                                </span>
                              </div>
                            </div>

                            {/* Sender */}
                            <div
                              style={{
                                fontSize: "12.5px",
                                color: "#64748b",
                                marginTop: "3px",
                              }}
                            >
                              {n.publisher?.name} · {n.publisher?.email}
                            </div>

                            {/* Body expand/collapse */}
                            <div
                              style={{
                                fontSize: "13.5px",
                                color: "#475569",
                                marginTop: "6px",
                                lineHeight: 1.55,
                                overflow: "hidden",
                                maxHeight: expanded ? "300px" : "38px",
                                transition: "max-height 0.25s ease",
                                WebkitMaskImage: expanded
                                  ? "none"
                                  : "linear-gradient(to bottom, black 30%, transparent 100%)",
                                maskImage: expanded
                                  ? "none"
                                  : "linear-gradient(to bottom, black 30%, transparent 100%)",
                              }}
                            >
                              {n.description}
                            </div>

                            {expanded && n.expireAt && (
                              <div
                                style={{
                                  marginTop: "8px",
                                  fontSize: "12px",
                                  color: "#f59e0b",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                ⏳ Expires:{" "}
                                {new Date(n.expireAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* ── Pagination ── */}
            {lastPage > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "12px",
                }}
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    background: page === 1 ? "#f8fafc" : "#fff",
                    color: page === 1 ? "#cbd5e1" : "#475569",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  ← Prev
                </button>
                <span style={{ fontSize: "13px", color: "#64748b" }}>
                  Page {page} of {lastPage}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  disabled={page === lastPage || isFetching}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    background: page === lastPage ? "#f8fafc" : "#fff",
                    color: page === lastPage ? "#cbd5e1" : "#475569",
                    cursor: page === lastPage ? "not-allowed" : "pointer",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
