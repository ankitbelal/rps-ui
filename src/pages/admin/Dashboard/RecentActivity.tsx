import React from "react";
import {
  FaUserPlus,
  FaChartLine,
  FaClipboardList,
  FaBell,
} from "react-icons/fa";
import { MdOutlineDoNotDisturb } from "react-icons/md";
import { TbPlugConnectedX } from "react-icons/tb";
import { useGetAuditLogsQuery } from "../../../features/admin/dashboard/dahboardApi";
import { AuditLogs } from "../../../features/admin/dashboard/utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const timeAgo = (dateStr: string): string => dayjs(dateStr).fromNow();

// ─── Icon + Type Map ─────────────────────────────────────────────────────────

type IconType = "success" | "warning" | "info" | "purple";

const getIconAndType = (
  actCode: string,
  isBatch?: boolean,
): { icon: React.ReactNode; type: IconType } => {
  if (isBatch || actCode === "SENROLL")
    return { icon: <FaUserPlus />, type: "info" };
  if (actCode === "SPROMO") return { icon: <FaChartLine />, type: "warning" };
  if (actCode === "RPUBLISH")
    return { icon: <FaClipboardList />, type: "success" };
  return { icon: <FaBell />, type: "purple" };
};

const iconBg: Record<IconType, string> = {
  success: "#dcfce7",
  warning: "#fef9c3",
  info: "#dbeafe",
  purple: "#ede9fe",
};

const iconColor: Record<IconType, string> = {
  success: "#16a34a",
  warning: "#ca8a04",
  info: "#2563eb",
  purple: "#7c3aed",
};

const rowBg: Record<IconType, string> = {
  success: "#f0fdf4",
  warning: "#fefce8",
  info: "#eff6ff",
  purple: "#faf5ff",
};

const rowBgHover: Record<IconType, string> = {
  success: "#dcfce7",
  warning: "#fef9c3",
  info: "#dbeafe",
  purple: "#ede9fe",
};

// ─── Skeleton ───────────────────────────────────────────────────────────────

const Sk = ({
  w,
  h,
  radius,
}: {
  w: string | number;
  h: number;
  radius?: number;
}) => (
  <div
    className="skeleton"
    style={{ width: w, height: h, borderRadius: radius ?? 6 }}
  />
);

const SkeletonItem: React.FC = () => (
  <div className="d-flex align-items-start gap-3 px-2 py-3">
    <Sk w={38} h={38} radius={10} />
    <div className="flex-grow-1 d-flex flex-column gap-2">
      <Sk w="50%" h={13} />
      <Sk w="75%" h={11} />
    </div>
    <Sk w={60} h={11} />
  </div>
);

// ─── Empty State ─────────────────────────────────────────────────────────────

const EmptyState: React.FC = () => (
  <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2 text-center">
    <MdOutlineDoNotDisturb size={42} color="#d1d5db" />
    <p className="fw-semibold mb-0 text-secondary" style={{ fontSize: 14 }}>
      No activities found
    </p>
    <p className="text-muted mb-0" style={{ fontSize: 12 }}>
      Actions performed in the system will appear here.
    </p>
  </div>
);

// ─── Error State ─────────────────────────────────────────────────────────────

const ErrorState: React.FC = () => (
  <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2 text-center">
    <TbPlugConnectedX size={42} color="#f87171" />
    <p className="fw-semibold mb-0 text-secondary" style={{ fontSize: 14 }}>
      No activities found
    </p>
    <p className="text-muted mb-0" style={{ fontSize: 12 }}>
      Could not reach the server. Please try again later.
    </p>
  </div>
);

// ─── Activity Row ─────────────────────────────────────────────────────────────

const ActivityRow: React.FC<{ log: AuditLogs }> = ({ log }) => {
  const { icon, type } = getIconAndType(log.actCode, log.isBatch);

  return (
    <div
      className="d-flex align-items-start gap-3 px-3 py-3 rounded-3"
      style={{
        transition: "background 0.15s",
        cursor: "default",
        background: rowBg[type],
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        marginBottom: 8,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = rowBgHover[type];
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = rowBg[type];
      }}
    >
      <div
        className="d-flex align-items-center justify-content-center flex-shrink-0"
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: iconBg[type],
          color: iconColor[type],
          fontSize: 15,
        }}
      >
        {icon}
      </div>

      <div className="flex-grow-1 overflow-hidden">
        <p
          className="mb-1 fw-semibold d-flex align-items-center gap-2"
          style={{
            fontSize: 15,
            color: "#111827",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {log.action}
          {log.isBatch && log.count !== undefined && (
            <span
              className="badge rounded-pill"
              style={{
                fontSize: 10,
                background: "#dbeafe",
                color: "#1d4ed8",
                fontWeight: 700,
              }}
            >
              {log.count}
            </span>
          )}
        </p>
        <p
          className="mb-0 text-muted"
          style={{
            fontSize: 12,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {log.comment}
        </p>
      </div>

      <div className="d-flex flex-column align-items-end flex-shrink-0 gap-1">
        <span
          className="text-muted"
          style={{ fontSize: 11, whiteSpace: "nowrap" }}
        >
          {timeAgo(log.createdAt)}
        </span>
        {log.name && (
          <span
            className="fw-medium"
            style={{ fontSize: 11, color: "#6b7280", whiteSpace: "nowrap" }}
          >
            {log.name}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const RecentActivity: React.FC = () => {
  const { data, isLoading, isError } = useGetAuditLogsQuery();

  return (
    <div
      className="bg-white rounded-4 p-4 d-flex flex-column"
      style={{ maxHeight: 480 }}
    >
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        {isLoading ? (
          <>
            <Sk w="38%" h={16} />
            <Sk w={20} h={20} radius={10} />
          </>
        ) : (
          <>
            <h6
              className="fw-bold mb-0"
              style={{ fontSize: 15, color: "#0f0f0f" }}
            >
              Recent Activities
            </h6>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 0 3px #dcfce7",
                display: "inline-block",
              }}
            />
          </>
        )}
      </div>

      {/* Scrollable list */}
      <div className="overflow-auto flex-grow-1" style={{ minHeight: 0 }}>
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => <SkeletonItem key={i} />)}

        {!isLoading && isError && <ErrorState />}

        {!isLoading && !isError && (!data?.data || data.data.length === 0) && (
          <EmptyState />
        )}

        {!isLoading &&
          !isError &&
          data?.data?.map((log, i, arr) => (
            <React.Fragment key={`${log.id}-${log.actCode}`}>
              <ActivityRow log={log} />
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};

export default RecentActivity;
