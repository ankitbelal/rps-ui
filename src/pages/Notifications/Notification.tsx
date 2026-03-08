import { useState } from "react";

/* ── Types ── */
type NotifType = "result" | "notice" | "message" | "alert";
type FilterTab = "all" | "unread" | "notice" | "message";

interface Notification {
  id: number;
  type: NotifType;
  read: boolean;
  title: string;
  body: string;
  sender: string;
  time: string;
  date: string;
  tag?: string;
}

interface TypeConfig {
  emoji: string;
  bg: string;
  color: string;
  label: string;
}

interface TabConfig {
  key: FilterTab;
  label: string;
  count: number;
}

/* ── Mock data ── */
const MOCK: Notification[] = [
  {
    id: 1,
    type: "result",
    read: false,
    title: "Result Published — BCA Semester 4",
    body: "The result for BCA Semester 4 (First Terminal) has been published. Students can now view their marks on the student portal.",
    sender: "Admin · Result System",
    time: "2 min ago",
    date: "Today",
    tag: "First Terminal",
  },
  {
    id: 2,
    type: "notice",
    read: false,
    title: "Holiday Notice: Dashain Break",
    body: "The college will remain closed from October 10 to October 20 for the Dashain festival. All classes and examinations are suspended during this period.",
    sender: "Admin · Academic Office",
    time: "1 hr ago",
    date: "Today",
    tag: "Holiday",
  },
  {
    id: 3,
    type: "message",
    read: false,
    title: "Your leave application has been approved",
    body: "Your leave application submitted on March 2 has been reviewed and approved by the department head. You are excused for 2 days.",
    sender: "Rohan Sharma · HOD",
    time: "3 hr ago",
    date: "Today",
  },
  {
    id: 4,
    type: "alert",
    read: false,
    title: "Incomplete Marks Detected — MCA Sem 2",
    body: "6 students in MCA Semester 2 have incomplete marks entries. Please ensure all marks are submitted before the deadline of March 15.",
    sender: "System · Marks Module",
    time: "5 hr ago",
    date: "Today",
    tag: "Action Required",
  },
  {
    id: 5,
    type: "result",
    read: true,
    title: "Result Published — MCA Semester 2",
    body: "Second Terminal results for MCA Semester 2 are now live. 42 students have been evaluated. Check the result portal for details.",
    sender: "Admin · Result System",
    time: "Yesterday",
    date: "Yesterday",
    tag: "Second Terminal",
  },
  {
    id: 6,
    type: "notice",
    read: true,
    title: "Examination Form Submission Deadline",
    body: "All students must fill and submit their examination forms by March 20, 2025. Late submissions will attract a fine of NPR 500.",
    sender: "Admin · Exam Cell",
    time: "2 days ago",
    date: "Mar 5",
  },
  {
    id: 7,
    type: "message",
    read: true,
    title: "Meeting scheduled: Faculty Review",
    body: "A faculty review meeting has been scheduled for March 12 at 10:00 AM in the conference room. Attendance is mandatory for all teaching staff.",
    sender: "Priya Thapa · Principal",
    time: "3 days ago",
    date: "Mar 4",
  },
  {
    id: 8,
    type: "notice",
    read: true,
    title: "Mid-Term Timetable Released",
    body: "The mid-term examination timetable has been uploaded to the portal. Students are advised to download and note their schedule.",
    sender: "Admin · Academic Office",
    time: "4 days ago",
    date: "Mar 3",
    tag: "Exam",
  },
  {
    id: 9,
    type: "alert",
    read: true,
    title: "Student Promotion Completed",
    body: "78 students from BCA Semester 3 have been promoted to Semester 4. The promotion log is available in the management panel.",
    sender: "System · Promotion Module",
    time: "5 days ago",
    date: "Mar 2",
  },
  {
    id: 10,
    type: "message",
    read: true,
    title: "Fee reminder for pending students",
    body: "15 students have pending fee payments for the current academic year. Please remind them to clear dues before March 31.",
    sender: "Accounts · Finance Dept",
    time: "1 week ago",
    date: "Feb 28",
  },
];

const TYPE_CONFIG: Record<NotifType, TypeConfig> = {
  result: { emoji: "📊", bg: "#e0f2fe", color: "#0369a1", label: "Result" },
  notice: { emoji: "📢", bg: "#fef9c3", color: "#854d0e", label: "Notice" },
  message: { emoji: "✉️", bg: "#f3e8ff", color: "#7e22ce", label: "Message" },
  alert: { emoji: "⚠️", bg: "#fee2e2", color: "#dc2626", label: "Alert" },
};

const TAG_COLORS: Record<NotifType, { bg: string; color: string }> = {
  result: { bg: "#e0f2fe", color: "#0369a1" },
  notice: { bg: "#fef9c3", color: "#854d0e" },
  message: { bg: "#f3e8ff", color: "#7e22ce" },
  alert: { bg: "#fee2e2", color: "#dc2626" },
};

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState<string>("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id: number): void =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  const markAllRead = (): void =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const deleteNotif = (
    id: number,
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleExpand = (id: number): void => {
    setExpandedId((prev) => (prev === id ? null : id));
    markRead(id);
  };

  const filtered = notifications.filter((n) => {
    const matchTab: boolean =
      activeTab === "all"
        ? true
        : activeTab === "unread"
          ? !n.read
          : n.type === activeTab;
    const q = search.toLowerCase();
    const matchSearch: boolean =
      !q ||
      n.title.toLowerCase().includes(q) ||
      n.body.toLowerCase().includes(q) ||
      n.sender.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const grouped = filtered.reduce<Record<string, Notification[]>>((acc, n) => {
    (acc[n.date] = acc[n.date] || []).push(n);
    return acc;
  }, {});

  const tabs: TabConfig[] = [
    { key: "all", label: "All", count: notifications.length },
    { key: "unread", label: "Unread", count: unreadCount },
    {
      key: "notice",
      label: "Notices",
      count: notifications.filter((n) => n.type === "notice").length,
    },
    {
      key: "message",
      label: "Messages",
      count: notifications.filter((n) => n.type === "message").length,
    },
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
                {unreadCount > 0 && (
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
                    {unreadCount} new
                  </span>
                )}
              </h4>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#64748b" }}>
                Messages, notices and system alerts
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
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
                cursor: "pointer",
              }}
            >
              ✓✓ Mark all as read
            </button>
          )}
        </div>

        {/* ── Search ── */}
        <div style={{ position: "relative", marginBottom: "14px" }}>
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
              fontSize: "13px",
            }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "9px 12px 9px 34px",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: "14px",
              color: "#344054",
              outline: "none",
              background: "#fff",
            }}
          />
        </div>

        {/* ── Tabs ── */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            marginBottom: "20px",
            borderBottom: "2px solid #e2e8f0",
          }}
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 14px",
                  fontSize: "14px",
                  fontWeight: active ? 700 : 500,
                  color: active ? "#0369a1" : "#64748b",
                  borderBottom: active
                    ? "2px solid #0369a1"
                    : "2px solid transparent",
                  marginBottom: "-2px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    style={{
                      background: active ? "#e0f2fe" : "#f1f5f9",
                      color: active ? "#0369a1" : "#64748b",
                      fontSize: "11.5px",
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: "999px",
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Notification list ── */}
        {Object.keys(grouped).length === 0 ? (
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
              No notifications found
            </div>
            <div style={{ fontSize: "13.5px", color: "#9ca3af" }}>
              Try a different filter or search term
            </div>
          </div>
        ) : (
          Object.entries(grouped).map(([date, items]) => (
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
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                {items.map((n) => {
                  const expanded = expandedId === n.id;
                  const cfg = TYPE_CONFIG[n.type];
                  return (
                    <div
                      key={n.id}
                      onClick={() => handleExpand(n.id)}
                      style={{
                        background: n.read ? "#fff" : "#f0f9ff",
                        border: `1px solid ${n.read ? "#e2e8f0" : "#bae6fd"}`,
                        borderRadius: "12px",
                        padding: "13px 15px",
                        cursor: "pointer",
                        boxShadow: expanded
                          ? "0 4px 16px rgba(0,0,0,0.07)"
                          : "none",
                        transition: "box-shadow 0.15s",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          alignItems: "flex-start",
                        }}
                      >
                        {/* Emoji icon */}
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: "10px",
                            background: n.read ? "#f1f5f9" : cfg.bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                            flexShrink: 0,
                          }}
                        >
                          {cfg.emoji}
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
                              {!n.read && (
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
                                  fontWeight: n.read ? 500 : 700,
                                  fontSize: "14.5px",
                                  color: "#0f172a",
                                }}
                              >
                                {n.title}
                              </span>
                              {n.tag && (
                                <span
                                  style={{
                                    fontSize: "11.5px",
                                    fontWeight: 600,
                                    padding: "2px 8px",
                                    borderRadius: "999px",
                                    ...TAG_COLORS[n.type],
                                  }}
                                >
                                  {n.tag}
                                </span>
                              )}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                flexShrink: 0,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "#94a3b8",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {n.time}
                              </span>
                              <button
                                onClick={(
                                  e: React.MouseEvent<HTMLButtonElement>,
                                ) => deleteNotif(n.id, e)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: "2px",
                                  color: "#cbd5e1",
                                  fontSize: "12px",
                                  lineHeight: 1,
                                }}
                                title="Remove"
                              >
                                🗑
                              </button>
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
                            {n.sender}
                          </div>

                          {/* Body with expand/collapse */}
                          <div
                            style={{
                              fontSize: "13.5px",
                              color: "#475569",
                              marginTop: "6px",
                              lineHeight: 1.55,
                              overflow: "hidden",
                              maxHeight: expanded ? "200px" : "38px",
                              transition: "max-height 0.25s ease",
                              WebkitMaskImage: expanded
                                ? "none"
                                : "linear-gradient(to bottom, black 30%, transparent 100%)",
                              maskImage: expanded
                                ? "none"
                                : "linear-gradient(to bottom, black 30%, transparent 100%)",
                            }}
                          >
                            {n.body}
                          </div>

                          {expanded && (
                            <div
                              style={{
                                marginTop: "8px",
                                fontSize: "12.5px",
                                color: "#94a3b8",
                              }}
                            >
                              📅 {n.date}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
