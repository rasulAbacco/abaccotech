// src/pages/dashboard/whatsapp/WhatsAppContacts.jsx
//
// 🆕 Contacts: import a CSV/Excel list, add one number, search, filter by
// tag and opt contacts out/in.

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Download, Plus, Search, Trash2, Upload, UserCheck, UserX } from "lucide-react";
import { downloadSampleCsv, waApi } from "./whatsappApi";
import { formatDateTime, formatNumber } from "./whatsappUtils";
import {
  ErrorBox,
  Pagination,
  Spinner,
  SuccessBox,
  WhatsAppShell,
  cardCls,
  inputCls,
  primaryBtn,
  secondaryBtn,
} from "./WhatsAppUI";

const STATUS_FILTERS = [
  { key: "active", label: "Active" },
  { key: "opted_out", label: "Opted out" },
  { key: "all", label: "All" },
];

export default function WhatsAppContacts() {
  const [tags, setTags] = useState([]);
  const [list, setList] = useState({ contacts: [], total: 0, page: 1, pageSize: 50 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState(null);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [tag, setTag] = useState("");
  const [status, setStatus] = useState("active");
  const [page, setPage] = useState(1);

  const loadTags = useCallback(async () => {
    try {
      setTags((await waApi.tags()).tags);
    } catch {
      /* the list call below shows the error */
    }
  }, []);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await waApi.contacts({ search, tag, status, page, pageSize: 50 });
      setList(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [search, tag, status, page]);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  // Search as you type, after a short pause
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const refreshAll = () => {
    loadTags();
    loadContacts();
  };

  const act = async (id, fn, okMessage) => {
    setBusyId(id);
    try {
      await fn();
      setNotice(okMessage);
      refreshAll();
    } catch (err) {
      setError(err);
    } finally {
      setBusyId(null);
    }
  };

  const activeTotal = tags.reduce((sum, t) => sum + t.count, 0);
  const namedTags = tags.filter((t) => t.tag);

  return (
    <WhatsAppShell
      title="Contacts"
      subtitle={`${formatNumber(activeTotal)} active contact${activeTotal === 1 ? "" : "s"} who can receive campaigns.`}
    >
      <ErrorBox error={error} onClose={() => setError(null)} />
      <SuccessBox message={notice} onClose={() => setNotice("")} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <ImportCard
          tags={namedTags}
          onDone={(msg) => {
            setNotice(msg);
            refreshAll();
          }}
          onError={setError}
        />
        <AddContactCard
          tags={namedTags}
          onDone={(msg) => {
            setNotice(msg);
            refreshAll();
          }}
          onError={setError}
        />
      </div>

      <div className={`${cardCls} p-6`}>
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or number"
              className={`${inputCls} pl-10`}
            />
          </div>
          <select
            value={tag}
            onChange={(e) => {
              setTag(e.target.value);
              setPage(1);
            }}
            className={`${inputCls} lg:w-56`}
          >
            <option value="">All tags</option>
            {namedTags.map((t) => (
              <option key={t.tag} value={t.tag}>
                {t.tag} ({t.count})
              </option>
            ))}
          </select>
          <div className="flex gap-1 bg-gray-800/40 border border-gray-800 rounded-xl p-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  setStatus(f.key);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  status === f.key ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading && list.contacts.length === 0 ? (
          <Spinner label="Loading contacts..." />
        ) : list.contacts.length === 0 ? (
          <p className="text-gray-500 text-sm py-10 text-center">
            {search || tag || status !== "active" ? "No contacts match these filters." : "No contacts yet — import a file above."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="py-2.5 pr-4 font-medium">Phone</th>
                  <th className="py-2.5 pr-4 font-medium">Name</th>
                  <th className="py-2.5 pr-4 font-medium">Tag</th>
                  <th className="py-2.5 pr-4 font-medium">Status</th>
                  <th className="py-2.5 pr-4 font-medium">Added</th>
                  <th className="py-2.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={loading ? "opacity-60" : ""}>
                {list.contacts.map((c) => {
                  const optedOut = Boolean(c.optedOutAt) || !c.optedIn;
                  return (
                    <tr key={c.id} className="border-b border-gray-800/60">
                      <td className="py-2.5 pr-4 text-white font-mono">+{c.phone}</td>
                      <td className="py-2.5 pr-4 text-gray-300">{c.name || "—"}</td>
                      <td className="py-2.5 pr-4 text-gray-400">{c.tag || "—"}</td>
                      <td className="py-2.5 pr-4">
                        {optedOut ? (
                          <span className="text-amber-300 text-xs">
                            Opted out{c.optedOutAt ? ` · ${formatDateTime(c.optedOutAt)}` : ""}
                          </span>
                        ) : (
                          <span className="text-green-400 text-xs">Active</span>
                        )}
                      </td>
                      <td className="py-2.5 pr-4 text-gray-500 text-xs whitespace-nowrap">{formatDateTime(c.createdAt)}</td>
                      <td className="py-2.5 text-right whitespace-nowrap">
                        {optedOut ? (
                          <button
                            disabled={busyId === c.id}
                            onClick={() => {
                              if (window.confirm(`Opt +${c.phone} back in? Only do this if they asked to receive messages again.`)) {
                                act(c.id, () => waApi.optIn(c.id), `+${c.phone} can receive campaigns again.`);
                              }
                            }}
                            className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-green-400 px-2 py-1"
                          >
                            <UserCheck className="w-4 h-4" /> Opt in
                          </button>
                        ) : (
                          <button
                            disabled={busyId === c.id}
                            onClick={() => act(c.id, () => waApi.optOut(c.id), `+${c.phone} won't receive campaigns.`)}
                            className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-amber-300 px-2 py-1"
                          >
                            <UserX className="w-4 h-4" /> Opt out
                          </button>
                        )}
                        <button
                          disabled={busyId === c.id}
                          onClick={() => {
                            if (window.confirm(`Delete +${c.phone}? Their campaign history is deleted too.`)) {
                              act(c.id, () => waApi.deleteContact(c.id), `+${c.phone} deleted.`);
                            }
                          }}
                          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 px-2 py-1"
                          aria-label="Delete contact"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={list.page} pageSize={list.pageSize} total={list.total} onChange={setPage} />
      </div>
    </WhatsAppShell>
  );
}

function ImportCard({ tags, onDone, onError }) {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [tag, setTag] = useState("");
  const [confirmOptIn, setConfirmOptIn] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [summary, setSummary] = useState(null);

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    setSummary(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("tag", tag.trim());
      form.append("confirmOptIn", String(confirmOptIn));
      const { summary: s } = await waApi.importContacts(form);
      setSummary(s);
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      onDone(`Import finished — ${s.created} new, ${s.updated} updated.`);
    } catch (err) {
      onError(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`${cardCls} p-6 xl:col-span-2`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Import contacts</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            CSV or Excel (.xlsx) with a phone column, and optionally name and tag. 10-digit numbers get +91 added.
          </p>
        </div>
        <button
          onClick={() => downloadSampleCsv().catch(onError)}
          className="inline-flex items-center gap-1.5 text-sm text-green-400 hover:text-green-300 shrink-0"
        >
          <Download className="w-4 h-4" /> Sample file
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-700 hover:border-green-500/50 rounded-xl p-6 cursor-pointer text-center transition">
          <Upload className="w-6 h-6 text-gray-400" />
          <span className="text-sm text-gray-300 break-all">{file ? file.name : "Choose a .csv or .xlsx file"}</span>
          <span className="text-xs text-gray-500">Up to 5 MB</span>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Tag for this list (optional)</label>
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              list="wa-import-tags"
              placeholder="e.g. supermarkets"
              className={inputCls}
            />
            <datalist id="wa-import-tags">
              {tags.map((t) => (
                <option key={t.tag} value={t.tag} />
              ))}
            </datalist>
            <p className="text-xs text-gray-500 mt-1">Used when the file has no tag column. Lets you send a campaign to just this group.</p>
          </div>
          <label className="flex items-start gap-2 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmOptIn}
              onChange={(e) => setConfirmOptIn(e.target.checked)}
              className="accent-green-500 mt-0.5"
            />
            These people agreed to receive WhatsApp messages from Abacco Tech.
          </label>
          <button onClick={upload} disabled={!file || !confirmOptIn || uploading} className={`${primaryBtn} w-full`}>
            <Upload className="w-4 h-4" />
            {uploading ? "Importing..." : "Import"}
          </button>
        </div>
      </div>

      {summary && (
        <div className="mt-5 border-t border-gray-800 pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            {[
              ["New", summary.created, "text-green-400"],
              ["Updated", summary.updated, "text-white"],
              ["Duplicates in file", summary.duplicatesInFile, "text-gray-300"],
              ["Kept opted out", summary.skippedOptedOut, "text-amber-300"],
              ["Invalid numbers", summary.invalid, "text-red-400"],
            ].map(([label, value, cls]) => (
              <div key={label} className="bg-gray-800/40 rounded-xl py-3">
                <p className={`text-xl font-bold ${cls}`}>{formatNumber(value)}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          {summary.invalidSamples?.length > 0 && (
            <p className="text-xs text-gray-400 mt-3">
              Invalid rows (first {summary.invalidSamples.length}):{" "}
              {summary.invalidSamples.map((s) => `row ${s.row}: "${s.value}"`).join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function AddContactCard({ tags, onDone, onError }) {
  const [form, setForm] = useState({ phone: "", name: "", tag: "" });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { contact } = await waApi.addContact(form);
      setForm({ phone: "", name: "", tag: form.tag });
      onDone(`+${contact.phone} added.`);
    } catch (err) {
      onError(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className={`${cardCls} p-6 space-y-3`}>
      <h2 className="text-lg font-semibold text-white">Add one contact</h2>
      <input
        required
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="Phone, e.g. 9876543210"
        className={inputCls}
      />
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Name (optional)"
        className={inputCls}
      />
      <input
        value={form.tag}
        onChange={(e) => setForm({ ...form, tag: e.target.value })}
        list="wa-add-tags"
        placeholder="Tag (optional)"
        className={inputCls}
      />
      <datalist id="wa-add-tags">
        {tags.map((t) => (
          <option key={t.tag} value={t.tag} />
        ))}
      </datalist>
      <button type="submit" disabled={saving || !form.phone.trim()} className={`${secondaryBtn} w-full`}>
        <Plus className="w-4 h-4" />
        {saving ? "Adding..." : "Add contact"}
      </button>
    </form>
  );
}
