// src/pages/dashboard/whatsapp/WhatsAppCampaignForm.jsx
//
// 🆕 Create (or edit a draft) campaign: pick any approved template, fill the
// values it needs, choose the audience, test-send to yourself, then send now,
// schedule, or save as a draft. Route: /whatsapp/campaigns/new and
// /whatsapp/campaigns/:id/edit

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CalendarClock, FlaskConical, Save, Send, Users } from "lucide-react";
import { waApi } from "./whatsappApi";
import { MEDIA_FORMATS, formatNumber } from "./whatsappUtils";
import {
  ErrorBox,
  MessagePreview,
  Spinner,
  SuccessBox,
  WhatsAppShell,
  cardCls,
  inputCls,
  primaryBtn,
  secondaryBtn,
} from "./WhatsAppUI";

const emptyValues = (t) => ({
  headerImageUrl: "",
  headerParams: Array(t?.header?.variables?.length || 0).fill(""),
  bodyParams: Array(t?.body?.variables?.length || 0).fill(""),
  buttonParams: Object.fromEntries((t?.buttons || []).filter((b) => b.hasVariable).map((b) => [b.index, ""])),
});

// "2026-11-02T10:30" in the browser's local time (for <input type="datetime-local">)
const toLocalInput = (date) => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const MEDIA_HINT = {
  IMAGE: "JPG or PNG, up to 5 MB",
  VIDEO: "MP4, up to 16 MB",
  DOCUMENT: "PDF, up to 100 MB",
};

export default function WhatsAppCampaignForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [templates, setTemplates] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState("");

  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [values, setValues] = useState(emptyValues(null));
  const [audienceTag, setAudienceTag] = useState("");
  const [audienceCount, setAudienceCount] = useState(null);
  const [sendMode, setSendMode] = useState("now"); // now | schedule | draft
  const [scheduledAt, setScheduledAt] = useState(() => toLocalInput(Date.now() + 60 * 60_000));

  const [testPhone, setTestPhone] = useState("");
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);

  const template = useMemo(() => templates.find((t) => t.id === Number(templateId)) || null, [templates, templateId]);

  // Load templates, tags and (when editing) the campaign
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [tplRes, tagRes, campRes] = await Promise.all([
          waApi.templates(),
          waApi.tags(),
          isEdit ? waApi.campaign(id) : Promise.resolve(null),
        ]);
        if (!alive) return;
        const usable = tplRes.templates.filter((t) => t.usable);
        setTemplates(usable);
        setTags(tagRes.tags.filter((t) => t.tag));

        if (campRes) {
          const c = campRes.campaign;
          if (c.status !== "DRAFT") {
            navigate(`/whatsapp/campaigns/${c.id}`, { replace: true });
            return;
          }
          setName(c.name);
          setTemplateId(c.templateId ? String(c.templateId) : "");
          setValues({
            headerImageUrl: c.headerImageUrl || "",
            headerParams: c.headerParams || [],
            bodyParams: c.bodyParams || [],
            buttonParams: c.buttonParams || {},
          });
          setAudienceTag(c.audienceTag || "");
        } else {
          const fromUrl = searchParams.get("template");
          const first = usable.find((t) => String(t.id) === fromUrl) || null;
          if (first) {
            setTemplateId(String(first.id));
            setValues(emptyValues(first));
          }
        }
      } catch (err) {
        if (alive) setError(err);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, isEdit, navigate, searchParams]);

  // Live audience size
  useEffect(() => {
    let alive = true;
    setAudienceCount(null);
    waApi
      .audienceCount(audienceTag || undefined)
      .then((d) => alive && setAudienceCount(d.count))
      .catch(() => alive && setAudienceCount(null));
    return () => {
      alive = false;
    };
  }, [audienceTag]);

  const pickTemplate = (value) => {
    setTemplateId(value);
    const t = templates.find((x) => x.id === Number(value));
    setValues(emptyValues(t));
  };

  const setParam = (key, index, value) =>
    setValues((v) => {
      const next = [...(v[key] || [])];
      next[index] = value;
      return { ...v, [key]: next };
    });

  const payload = () => ({
    name: name.trim(),
    templateId: Number(templateId),
    headerImageUrl: values.headerImageUrl.trim(),
    headerParams: values.headerParams,
    bodyParams: values.bodyParams,
    buttonParams: values.buttonParams,
    audienceTag: audienceTag || null,
  });

  const testSend = async () => {
    setTesting(true);
    setError(null);
    setNotice("");
    try {
      const { result } = await waApi.testSend({ ...payload(), phone: testPhone, testName: "Test" });
      setNotice(`Test message sent to +${result.to}. Check WhatsApp on that phone.`);
    } catch (err) {
      setError(err);
    } finally {
      setTesting(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setNotice("");

    if (sendMode === "now") {
      const n = audienceCount ?? 0;
      if (!window.confirm(`Send "${name.trim() || "this campaign"}" to ${formatNumber(n)} contact${n === 1 ? "" : "s"} now?`)) return;
    }
    let scheduleIso = null;
    if (sendMode === "schedule") {
      const when = new Date(scheduledAt);
      if (Number.isNaN(when.getTime()) || when.getTime() < Date.now() + 2 * 60_000) {
        setError("Pick a schedule time at least a few minutes from now.");
        return;
      }
      scheduleIso = when.toISOString();
    }

    setSaving(true);
    let campaignId = isEdit ? Number(id) : null;
    try {
      if (isEdit) await waApi.updateCampaign(id, payload());
      else campaignId = (await waApi.createCampaign(payload())).campaign.id;
    } catch (err) {
      setError(err);
      setSaving(false);
      return;
    }

    // Saved as a draft — now send or schedule it if asked.
    let launchError = null;
    if (sendMode !== "draft") {
      try {
        await waApi.launch(campaignId, scheduleIso);
      } catch (err) {
        launchError = { message: err.message, errors: err.errors };
      }
    }
    setSaving(false);
    navigate(`/whatsapp/campaigns/${campaignId}`, { state: launchError ? { error: launchError } : null });
  };

  const isMedia = template && MEDIA_FORMATS.includes(template.header?.format);
  const varButtons = (template?.buttons || []).filter((b) => b.hasVariable);

  return (
    <WhatsAppShell
      title={isEdit ? "Edit campaign" : "New campaign"}
      subtitle="Choose an approved template, fill in its values and pick who receives it."
      back={{ to: isEdit ? `/whatsapp/campaigns/${id}` : "/whatsapp", label: isEdit ? "Back to campaign" : "All campaigns" }}
    >
      <ErrorBox error={error} onClose={() => setError(null)} />
      <SuccessBox message={notice} onClose={() => setNotice("")} />

      {loading ? (
        <Spinner />
      ) : templates.length === 0 ? (
        <div className={`${cardCls} p-10 text-center`}>
          <p className="text-white font-semibold">No approved templates yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Sync your templates from Meta first.{" "}
            <Link to="/whatsapp/templates" className="text-green-400 hover:text-green-300">
              Go to Templates
            </Link>
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3 space-y-6">
            {/* 1. Basics */}
            <section className={`${cardCls} p-6 space-y-4`}>
              <h2 className="text-lg font-semibold text-white">1. Campaign</h2>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Campaign name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Diwali billing software offer"
                  className={inputCls}
                />
                <p className="text-xs text-gray-500 mt-1">Only you see this name.</p>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Template</label>
                <select required value={templateId} onChange={(e) => pickTemplate(e.target.value)} className={inputCls}>
                  <option value="">Select a template</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.language}) — {t.category?.toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            {/* 2. Template values */}
            {template && (
              <section className={`${cardCls} p-6 space-y-4`}>
                <div>
                  <h2 className="text-lg font-semibold text-white">2. Message content</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Type <code className="text-green-400">{"{{name}}"}</code> in any value to insert each contact's name
                    ("Customer" if they have none).
                  </p>
                </div>

                {isMedia && (
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5">
                      Header {template.header.format.toLowerCase()} link
                    </label>
                    <input
                      required
                      type="url"
                      value={values.headerImageUrl}
                      onChange={(e) => setValues({ ...values, headerImageUrl: e.target.value })}
                      placeholder="https://..."
                      className={inputCls}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Must be a public https:// link Meta can open ({MEDIA_HINT[template.header.format]}). Your R2 public
                      URL works well.
                    </p>
                  </div>
                )}

                {(template.header?.variables || []).map((v, i) => (
                  <VariableInput
                    key={`h${v}`}
                    label={`Header {{${v}}}`}
                    value={values.headerParams[i] || ""}
                    onChange={(val) => setParam("headerParams", i, val)}
                  />
                ))}

                {(template.body?.variables || []).map((v, i) => (
                  <VariableInput
                    key={`b${v}`}
                    label={`Body {{${v}}}`}
                    value={values.bodyParams[i] || ""}
                    onChange={(val) => setParam("bodyParams", i, val)}
                    showNameChip
                  />
                ))}

                {varButtons.map((b) => (
                  <div key={b.index}>
                    <label className="block text-sm text-gray-300 mb-1.5">
                      Button "{b.text}" — {b.type === "COPY_CODE" ? "coupon code" : "link ending"}
                    </label>
                    <input
                      required
                      value={values.buttonParams?.[b.index] || ""}
                      onChange={(e) =>
                        setValues({ ...values, buttonParams: { ...values.buttonParams, [b.index]: e.target.value } })
                      }
                      placeholder={b.type === "COPY_CODE" ? "e.g. DIWALI20" : "e.g. diwali-offer"}
                      className={inputCls}
                    />
                    {b.type === "URL" && b.url && (
                      <p className="text-xs text-gray-500 mt-1 break-all">
                        Opens {b.url.replace(/\{\{.*?\}\}/, values.buttonParams?.[b.index] || "…")}
                      </p>
                    )}
                  </div>
                ))}

                {!isMedia &&
                  !(template.header?.variables || []).length &&
                  !(template.body?.variables || []).length &&
                  !varButtons.length && (
                    <p className="text-sm text-gray-400">This template has nothing to fill in — it's sent exactly as approved.</p>
                  )}
              </section>
            )}

            {/* 3. Audience */}
            <section className={`${cardCls} p-6 space-y-4`}>
              <h2 className="text-lg font-semibold text-white">{template ? "3" : "2"}. Audience</h2>
              <select value={audienceTag} onChange={(e) => setAudienceTag(e.target.value)} className={inputCls}>
                <option value="">All active contacts</option>
                {tags.map((t) => (
                  <option key={t.tag} value={t.tag}>
                    Tag: {t.tag} ({formatNumber(t.count)})
                  </option>
                ))}
              </select>
              <p className="flex items-center gap-2 text-sm text-gray-300">
                <Users className="w-4 h-4 text-green-400" />
                {audienceCount === null ? "Counting..." : `${formatNumber(audienceCount)} contacts will receive this`}
                <span className="text-gray-500">· opted-out contacts are always skipped</span>
              </p>
              {audienceCount === 0 && (
                <p className="text-sm text-amber-300">
                  No active contacts here.{" "}
                  <Link to="/whatsapp/contacts" className="underline">
                    Import contacts
                  </Link>{" "}
                  first.
                </p>
              )}
            </section>

            {/* 4. Send */}
            <section className={`${cardCls} p-6 space-y-4`}>
              <h2 className="text-lg font-semibold text-white">{template ? "4" : "3"}. When to send</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { key: "now", label: "Send now", icon: Send },
                  { key: "schedule", label: "Schedule", icon: CalendarClock },
                  { key: "draft", label: "Save as draft", icon: Save },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setSendMode(key)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition ${
                      sendMode === key
                        ? "bg-green-500/15 border-green-500/50 text-green-300"
                        : "border-gray-700 text-gray-400 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
              {sendMode === "schedule" && (
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">Send at (your local time)</label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    min={toLocalInput(Date.now())}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className={`${inputCls} sm:w-72 [color-scheme:dark]`}
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={saving || !template || (sendMode !== "draft" && audienceCount === 0)}
                className={`${primaryBtn} w-full py-3`}
              >
                {saving
                  ? "Saving..."
                  : sendMode === "now"
                    ? `Send to ${audienceCount === null ? "…" : formatNumber(audienceCount)} contacts`
                    : sendMode === "schedule"
                      ? "Schedule campaign"
                      : "Save draft"}
              </button>
            </section>
          </div>

          {/* Preview + test send */}
          <div className="xl:col-span-2">
            <div className="xl:sticky xl:top-8 space-y-6">
              <section className={`${cardCls} p-6`}>
                <h2 className="text-lg font-semibold text-white mb-4">Preview</h2>
                <MessagePreview template={template} values={values} contactName="Ravi" />
              </section>

              <section className={`${cardCls} p-6 space-y-3`}>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-green-400" /> Send a test
                </h2>
                <p className="text-xs text-gray-400">
                  Sends this exact message to one number (your own) so you can check it before everyone gets it. Not
                  saved in the campaign.
                </p>
                <div className="flex gap-2">
                  <input
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="Your WhatsApp number"
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={testSend}
                    disabled={testing || !template || !testPhone.trim()}
                    className={`${secondaryBtn} shrink-0`}
                  >
                    {testing ? "Sending..." : "Send test"}
                  </button>
                </div>
              </section>
            </div>
          </div>
        </form>
      )}
    </WhatsAppShell>
  );
}

function VariableInput({ label, value, onChange, showNameChip }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm text-gray-300">{label}</label>
        {showNameChip && (
          <button
            type="button"
            onClick={() => onChange(`${value}${value && !value.endsWith(" ") ? " " : ""}{{name}}`)}
            className="text-xs text-green-400 hover:text-green-300"
          >
            + contact name
          </button>
        )}
      </div>
      <input required value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </div>
  );
}
