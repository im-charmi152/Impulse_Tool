import { useMemo } from "react";

import {
  BadgeCheck,
  ChevronRight,
  Database,
  FileText,
  Globe,
  Hash,
  Send,
  Settings,
} from "lucide-react";

import SectionCard from "../common/SectionCard";
import Badge from "../common/Badge";

import {
  openPartnerSetupDetailsTab,
} from "../../utils/detailsNavigation";

import {
  normalizeSetupRecord,
  statusColor,
} from "./setupDetailsUtils";

import "./SetupConfigDetails.css";

/* =========================================================
   TABLE COLUMNS
   ========================================================= */

const TABLE_COLUMNS = [
  {
    key: "srceSysKeyId",
    label: "Source System Key",
    icon: Hash,
    className: "partner-col-key",
  },
  {
    key: "srceSysId",
    label: "Source System",
    icon: Globe,
    className: "partner-col-source",
  },
  {
    key: "formatId",
    label: "Format",
    icon: FileText,
    className: "partner-col-format",
  },
  {
    key: "docId",
    label: "Document ID",
    icon: FileText,
    className: "partner-col-doc",
  },
  {
    key: "commuId",
    label: "Communication ID",
    icon: Send,
    className: "partner-col-communication",
  },
  {
    key: "dirFlgCd",
    label: "Direction",
    icon: BadgeCheck,
    className: "partner-col-direction",
  },
  {
    key: "internetAddrTxt",
    label: "Internet Address",
    icon: Globe,
    className: "partner-col-address",
  },
  {
    key: "sendThruId",
    label: "Send Thru",
    icon: Database,
    className: "partner-col-send",
  },
  {
    key: "activeStatus",
    label: "Status",
    icon: Settings,
    className: "partner-col-status",
  },
];

/* =========================================================
   HELPERS
   ========================================================= */

function isEmptyValue(value) {
  return (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "—"
  );
}

/* =========================================================
   TABLE CELL
   ========================================================= */

function SetupTableCell({ column, value }) {
  if (isEmptyValue(value)) {
    return (
      <span className="partner-table-empty">
        —
      </span>
    );
  }

  /* STATUS */

  if (column.key === "activeStatus") {
    return (
      <Badge color={statusColor(value)}>
        {value}
      </Badge>
    );
  }

  /* SOURCE SYSTEM KEY */

  if (column.key === "srceSysKeyId") {
    return (
      <div className="partner-source-key">
        <span className="partner-source-key-icon">
          <Hash size={12} />
        </span>

        <span
          className="partner-source-key-value"
          title={String(value)}
        >
          {String(value)}
        </span>
      </div>
    );
  }

  /* SOURCE SYSTEM */

  if (column.key === "srceSysId") {
    return (
      <div className="partner-source-key">
        <span className="partner-source-key-icon">
          <Globe size={12} />
        </span>

        <span
          className="partner-table-value"
          title={String(value)}
        >
          {String(value)}
        </span>
      </div>
    );
  }

  /* NORMAL VALUE */

  return (
    <span
      className="partner-table-value"
      title={String(value)}
    >
      {String(value)}
    </span>
  );
}

/* =========================================================
   TABLE HEADER
   ========================================================= */

function SetupTableHeader() {
  return (
    <div className="partner-table-header">

      {TABLE_COLUMNS.map((column) => {
        const Icon = column.icon;

        return (
          <div
            key={column.key}
            className={`partner-table-header-cell ${column.className}`}
          >
            <div className="partner-table-header-content">
              <Icon
                size={11}
                className="partner-table-header-icon"
              />

              <span>
                {column.label}
              </span>
            </div>
          </div>
        );
      })}

      <div className="partner-table-header-cell partner-table-action-header">
        Actions
      </div>
    </div>
  );
}

/* =========================================================
   TABLE ROW
   ========================================================= */

function SetupTableRow({ record }) {
  const handleOpenDetails = () => {
    openPartnerSetupDetailsTab(record);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpenDetails();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="partner-table-row"
      onClick={handleOpenDetails}
      onKeyDown={handleKeyDown}
      title="Click to view complete partner setup details"
    >
      {TABLE_COLUMNS.map((column) => (
        <div
          key={column.key}
          className={`partner-table-cell ${column.className}`}
        >
          <SetupTableCell
            column={column}
            value={record[column.key]}
          />
        </div>
      ))}

      <div className="partner-table-cell partner-table-action-cell">
        <button
          type="button"
          className="partner-view-button"
          onClick={(event) => {
            event.stopPropagation();
            handleOpenDetails();
          }}
          aria-label={`View details for ${record.srceSysKeyId}`}
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

function SetupConfigDetails({ config }) {
  /* =======================================================
     NORMALIZE CONFIGURATION
     ======================================================= */

  const records = useMemo(() => {
    if (Array.isArray(config)) {
      return config
        .filter(
          (entry) =>
            entry &&
            typeof entry === "object" &&
            !Array.isArray(entry)
        )
        .map((entry) => normalizeSetupRecord(entry));
    }

    if (
      config &&
      typeof config === "object" &&
      !Array.isArray(config)
    ) {
      return [normalizeSetupRecord(config)];
    }

    return [];
  }, [config]);

  /* =======================================================
     FALLBACK
     ======================================================= */

  const fallbackRecord = useMemo(
    () => ({
      ...normalizeSetupRecord({}),
      activeStatus: "—",
    }),
    []
  );

  const displayRecords =
    records.length > 0
      ? records
      : [fallbackRecord];

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <SectionCard
      icon={Settings}
      title="Partner Setup Details"
    >
      <div className="partner-setup-table-wrapper">

        <div className="partner-table">

          {/* HEADER */}

          <SetupTableHeader />

          {/* BODY */}

          <div className="partner-table-body">
            {displayRecords.map((record, index) => (
              <SetupTableRow
                key={`${record.srceSysKeyId || "setup"}-${index}`}
                record={record}
              />
            ))}
          </div>

        </div>
      </div>

      {/* FOOTER */}

      {records.length > 0 && (
        <div className="partner-table-footer">

          <div className="partner-table-record-count">
            <span className="partner-record-count-dot" />

            <span>
              {records.length} Source System Key
              {records.length !== 1 ? "s" : ""}
            </span>
          </div>

          <span className="partner-table-footer-hint">
            Click a row to view complete setup details
          </span>

        </div>
      )}
    </SectionCard>
  );
}

export default SetupConfigDetails;