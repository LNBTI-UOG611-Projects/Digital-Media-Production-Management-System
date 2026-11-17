"use client";

import { useState } from "react";
import {Button} from "@/components/ui/Button";
import Card from "@/components/freelancer/Card";
import { formatLkr } from "@/components/freelancer/format";
import type { OpenRole } from "@/lib/mock/freelancer";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Colombo" });
}

export default function OpenRoles({ roles }: { roles: OpenRole[] }) {
  const [requested, setRequested] = useState<number[]>([]);

  return (
    <Card title="Open roles for you">
      <ul className="divide-y divide-line">
        {roles.map((r) => {
          const done = requested.includes(r.id);
          return (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div>
                <p className="font-semibold">{r.role_title}</p>
                <p className="text-sm text-muted">
                  {r.project_type}, {formatDate(r.shoot_date)}, {r.location}
                </p>
                <p className="text-sm">{formatLkr(r.rate)} per day</p>
              </div>
              {done ? (
                <span className="text-sm font-semibold text-burgundy">Request sent</span>
              ) : (
                <Button onClick={() => setRequested((prev) => [...prev, r.id])}>Request job</Button>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-sm text-muted">Client details stay hidden until your request is confirmed.</p>
    </Card>
  );
}
