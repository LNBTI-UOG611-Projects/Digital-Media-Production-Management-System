"use client";

import { useState } from "react";
import {Button} from "@/components/ui/Button";
import Card from "@/components/freelancer/Card";
import { formatLkr } from "@/components/freelancer/format";
import type { Invitation } from "@/lib/mock/freelancer";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Colombo" });
}
function formatExpiry(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Colombo",
  });
}

export default function InvitationCard({ invitation }: { invitation: Invitation }) {
  const [state, setState] = useState<"pending" | "accepted" | "declined">("pending");

  return (
    <Card title="Invitation for you">
      <div className="rounded-md border border-line bg-ivory p-4">
        <p className="font-semibold">{invitation.role_title}</p>
        <p className="text-sm text-muted">
          {invitation.project_type}, {formatDate(invitation.shoot_date)}, {invitation.location}
        </p>
        <p className="mt-1 text-sm">{formatLkr(invitation.rate)} per day</p>
        <p className="mt-2 text-sm font-semibold text-burgundy">Reply before {formatExpiry(invitation.expires_at)}</p>
      </div>

      <div className="mt-4" aria-live="polite">
        {state === "pending" ? (
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setState("accepted")}>Accept</Button>
            <button
              type="button"
              onClick={() => setState("declined")}
              className="rounded-md border border-burgundy px-4 py-2 text-sm font-semibold text-burgundy hover:bg-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
            >
              Decline
            </button>
          </div>
        ) : (
          <p className="text-sm font-semibold">
            {state === "accepted" ? "Accepted. The owner has been notified." : "Declined. We will offer this role to someone else."}
          </p>
        )}
      </div>
    </Card>
  );
}
