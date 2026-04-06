"use client";

import { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import {
  formatDate,
  formatComplianceType,
} from "@/lib/utils/format";

interface ComplianceAction {
  id: string;
  type: string;
  description: string;
  dateIssued: string | Date;
  dateResolved: string | Date | null;
  isActive: boolean;
  sourceUrl: string | null;
}

interface ComplianceTabProps {
  registrationStatus: string;
  ndisRegistered: boolean;
  ndisProviderNumber: string | null;
  lastAuditDate: string | Date | null;
  conditionsOnReg: string | null;
  registrationGroups: string[];
  complianceActions: ComplianceAction[];
  createdAt: string | Date;
}

export function ComplianceTab({
  registrationStatus,
  ndisRegistered,
  ndisProviderNumber,
  lastAuditDate,
  conditionsOnReg,
  registrationGroups,
  complianceActions,
}: ComplianceTabProps) {
  const activeActions = complianceActions.filter((a) => a.isActive);
  const resolvedActions = complianceActions.filter(
    (a) => !a.isActive && a.dateResolved
  );

  return (
    <div>
      {/* Registration Status */}
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Registration Status
      </h3>

      {ndisRegistered &&
      (registrationStatus === "REGISTERED" ||
        registrationStatus === "CONDITIONS_APPLIED") ? (
        <div
          className={`rounded-lg border p-5 ${
            registrationStatus === "CONDITIONS_APPLIED"
              ? "border-amber-200 bg-amber-50"
              : "border-green-200 bg-green-50"
          }`}
        >
          <div className="flex items-center gap-2">
            {registrationStatus === "CONDITIONS_APPLIED" ? (
              <AlertTriangle size={20} className="text-amber-600" />
            ) : (
              <ShieldCheck size={20} className="text-green-600" />
            )}
            <span
              className={`font-medium ${
                registrationStatus === "CONDITIONS_APPLIED"
                  ? "text-amber-800"
                  : "text-green-800"
              }`}
            >
              {registrationStatus === "CONDITIONS_APPLIED"
                ? "Registered — Conditions Applied"
                : "Registered with the NDIS Quality and Safeguards Commission"}
            </span>
          </div>
          <div className="mt-4 space-y-1.5 text-sm">
            {ndisProviderNumber && (
              <div className="flex gap-2">
                <span className="text-gray-500">Provider Number:</span>
                <span className="text-gray-700">{ndisProviderNumber}</span>
              </div>
            )}
            {lastAuditDate && (
              <div className="flex gap-2">
                <span className="text-gray-500">Last Audit:</span>
                <span className="text-gray-700">
                  {formatDate(lastAuditDate)}
                </span>
              </div>
            )}
          </div>
          {conditionsOnReg && (
            <p className="mt-3 text-sm text-amber-700">{conditionsOnReg}</p>
          )}
          {registrationGroups.length > 0 && (
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-700">
                Registration Groups:
              </span>
              <ul className="mt-1 space-y-1">
                {registrationGroups.map((group, i) => (
                  <li key={i} className="pl-3 text-sm text-gray-700">
                    · {group}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
          <div className="flex items-center gap-2">
            <Info size={20} className="text-gray-500" />
            <span className="font-medium text-gray-700">
              {registrationStatus === "DEREGISTERED"
                ? "This provider has been de-registered"
                : "This provider is not registered with the NDIS Quality and Safeguards Commission"}
            </span>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            Unregistered providers can deliver services to self-managed and
            plan-managed participants. They must still comply with the NDIS Code
            of Conduct.
          </p>
        </div>
      )}

      {/* Compliance Actions */}
      <h3 className="mb-4 mt-8 text-lg font-semibold text-gray-900">
        Compliance Actions
      </h3>

      {activeActions.length === 0 ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-600" />
            <span className="font-medium text-green-800">
              No active compliance actions
            </span>
          </div>
          <p className="mt-1 text-sm text-green-700">
            This provider has no active compliance actions recorded with the NDIS
            Quality and Safeguards Commission.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-700">
            Active
          </p>
          {activeActions.map((action) => (
            <div
              key={action.id}
              className="mb-3 rounded-lg border border-red-200 bg-red-50 p-4"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-600" />
                <span className="font-medium text-red-800">
                  {formatComplianceType(action.type)}
                </span>
              </div>
              <p className="mt-1 text-sm text-red-700">
                Issued: {formatDate(action.dateIssued)}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-red-700">
                {action.description}
              </p>
              {action.sourceUrl && (
                <a
                  href={action.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800 hover:underline"
                >
                  View on NDIS Commission website
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          ))}
        </>
      )}

      {/* Resolved History */}
      {resolvedActions.length > 0 && (
        <>
          <p className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
            History
          </p>
          {resolvedActions.map((action) => (
            <ResolvedAction key={action.id} action={action} />
          ))}
        </>
      )}

      {/* Explanatory Note */}
      <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-center gap-2">
          <Info size={18} className="text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            About compliance information
          </span>
        </div>
        <p className="mt-2 text-sm text-blue-700">
          Compliance information is sourced from the NDIS Quality and Safeguards
          Commission. A compliance action does not necessarily mean a provider is
          unsafe. Actions may include conditions designed to improve service
          quality. For the most current information, visit the NDIS Commission
          website.
        </p>
        <a
          href="https://www.ndiscommission.gov.au"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          Visit NDIS Commission
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}

function ResolvedAction({ action }: { action: ComplianceAction }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center gap-2">
        <CheckCircle2 size={18} className="text-gray-400" />
        <span className="font-medium text-gray-700">
          {formatComplianceType(action.type)}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Issued: {formatDate(action.dateIssued)} — Resolved:{" "}
        {action.dateResolved ? formatDate(action.dateResolved) : "Unknown"}
      </p>
      {expanded && (
        <p className="mt-2 text-sm text-gray-600">{action.description}</p>
      )}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 text-sm text-blue-600 hover:underline"
      >
        {expanded ? "Hide details" : "Show details"}
      </button>
    </div>
  );
}
