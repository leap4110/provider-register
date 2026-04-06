"use client";

import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface NotificationSetting {
  key: string;
  label: string;
  description: string;
}

const settings: NotificationSetting[] = [
  {
    key: "emailEnabled",
    label: "Email Notifications",
    description: "Receive notifications via email for important updates",
  },
  {
    key: "smsEnabled",
    label: "SMS Notifications",
    description: "Get text messages for time-sensitive alerts",
  },
  {
    key: "serviceRequests",
    label: "Service Request Alerts",
    description: "Be notified when new service requests match your offerings",
  },
  {
    key: "reviewAlerts",
    label: "Review Alerts",
    description: "Get notified when a participant leaves a review",
  },
  {
    key: "marketingEmails",
    label: "Marketing Emails",
    description: "Receive tips, product updates, and promotional content",
  },
];

type SettingsState = Record<string, boolean>;

const defaultState: SettingsState = {
  emailEnabled: true,
  smsEnabled: true,
  serviceRequests: true,
  reviewAlerts: true,
  marketingEmails: false,
};

export default function NotificationsPage() {
  const [values, setValues] = useState<SettingsState>(defaultState);
  const [saving, setSaving] = useState(false);

  function toggle(key: string) {
    setValues((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        toast.success("Notification settings saved");
      } else {
        toast.error("Failed to save settings");
      }
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900">
        Notification Settings
      </h1>
      <p className="text-sm text-gray-500">
        Choose how and when you want to be notified
      </p>

      <div className="mt-6 max-w-2xl space-y-1 rounded-xl border bg-white">
        {settings.map((setting, idx) => (
          <div
            key={setting.key}
            className={`flex items-center justify-between px-6 py-4 ${
              idx < settings.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <div>
              <p className="text-sm font-medium text-gray-900">
                {setting.label}
              </p>
              <p className="text-sm text-gray-500">{setting.description}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={values[setting.key]}
              onClick={() => toggle(setting.key)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                values[setting.key] ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  values[setting.key] ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 max-w-2xl">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="h-11 bg-blue-600 px-8 font-medium text-white hover:bg-blue-700"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>

      <div className="mt-6 flex max-w-2xl items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
        <p className="text-sm text-gray-500">
          Emails are sent from{" "}
          <span className="font-medium text-gray-700">
            notifications@providerregister.com.au
          </span>
          . Please add this address to your trusted senders to ensure delivery.
        </p>
      </div>
    </div>
  );
}
