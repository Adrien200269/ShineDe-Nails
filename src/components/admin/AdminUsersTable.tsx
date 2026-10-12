"use client";

import * as React from "react";
import { User, Mail, Phone, Ruler, Sparkles, Package } from "lucide-react";
import { UserProfile } from "@/types";

interface AdminUsersTableProps {
  profiles: Array<UserProfile & { _count?: { customOrders?: number } }>;
}

export function AdminUsersTable({ profiles }: AdminUsersTableProps) {
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    return profiles.filter(
      (p) =>
        p.email?.toLowerCase().includes(search.toLowerCase()) ||
        p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.phone?.toLowerCase().includes(search.toLowerCase())
    );
  }, [profiles, search]);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
            Clientele & Sizing Directory
          </h3>
          <p className="text-xs text-gray-500 dark:text-brand-dark-muted">
            All registered nail clients across Nepal with saved custom profiles
          </p>
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name or email..."
            className="w-full rounded-full border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface px-4 py-2 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-primary shadow-xs"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead className="bg-pink-50/70 dark:bg-brand-dark-card/70 border-b border-pink-200/80 dark:border-brand-dark-border text-gray-500 dark:text-brand-dark-muted font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Saved Sizing Profile</th>
                <th className="py-3.5 px-4">Total Sets</th>
                <th className="py-3.5 px-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-100 dark:divide-brand-dark-border/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    No customers found matching search.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => {
                  const saved = user.saved_measurements;
                  const hasCustom = saved?.type === "custom" && saved.measurements;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-pink-50/40 dark:hover:bg-brand-dark-card/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-brand-primary-light text-brand-primary flex items-center justify-center font-bold font-serif text-sm">
                            {(user.full_name || user.email || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white">
                              {user.full_name || "ShineDe Member"}
                            </div>
                            <div className="text-[11px] text-gray-500 dark:text-brand-dark-muted">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-xs text-gray-700 dark:text-brand-dark-text">
                          {user.phone || "—"}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {hasCustom ? (
                          <div className="text-[11px] font-mono text-brand-primary font-bold">
                            T:{saved.measurements?.thumb}mm · I:{saved.measurements?.index}mm · M:{saved.measurements?.middle}mm · R:{saved.measurements?.ring}mm · P:{saved.measurements?.pinky}mm
                          </div>
                        ) : saved?.standardSize ? (
                          <span className="bg-pink-100 dark:bg-pink-950/60 text-brand-primary text-xs font-bold px-2 py-0.5 rounded-md">
                            Standard {saved.standardSize}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs italic">Not saved yet</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">
                        <span className="inline-flex items-center gap-1">
                          <Package className="w-3.5 h-3.5 text-brand-primary" />
                          <span>{user._count?.customOrders || 1} Orders</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-gray-500 dark:text-brand-dark-muted">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Recent"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
