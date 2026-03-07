"use client";

import * as React from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ABOUT_US_ADMIN } from "@/app/api/query";
import { UPDATE_ABOUT_US } from "@/app/api/mutations";

const FIELDS = [
  { key: "title", label: "Page title", textarea: false },
  { key: "historyTitle", label: "History section title", textarea: false },
  { key: "historyText", label: "History section text", textarea: true },
  { key: "whyUsTitle", label: "Why us section title", textarea: false },
  { key: "whyUsText", label: "Why us section text", textarea: true },
  { key: "privacyTitle", label: "Privacy section title", textarea: false },
  { key: "privacyText", label: "Privacy section text", textarea: true },
] as const;

type LangBlock = { hy?: string | null; en?: string | null; ru?: string | null };

type AboutUsAdmin = {
  id: string;
  title: LangBlock;
  historyTitle: LangBlock;
  historyText: LangBlock;
  whyUsTitle: LangBlock;
  whyUsText: LangBlock;
  privacyTitle: LangBlock;
  privacyText: LangBlock;
};

type FormState = Record<
  (typeof FIELDS)[number]["key"],
  { hy: string; en: string; ru: string }
>;

const emptyForm = (): FormState =>
  FIELDS.reduce(
    (acc, { key }) => {
      acc[key] = { hy: "", en: "", ru: "" };
      return acc;
    },
    {} as FormState,
  );

export default function AboutUsPage() {
  const { data, loading, error, refetch } = useQuery<{
    aboutUsAdmin: AboutUsAdmin;
  }>(ABOUT_US_ADMIN);
  const [updateAboutUs, { loading: saving }] = useMutation(UPDATE_ABOUT_US, {
    onCompleted: () => refetch(),
  });

  const [form, setForm] = React.useState<FormState>(emptyForm());

  const admin = data?.aboutUsAdmin;

  React.useEffect(() => {
    if (!admin) return;
    const next = emptyForm();
    FIELDS.forEach(({ key }) => {
      const block = admin[key];
      next[key] = {
        hy: block?.hy ?? "",
        en: block?.en ?? "",
        ru: block?.ru ?? "",
      };
    });
    setForm(next);
  }, [admin]);

  const update = (
    key: (typeof FIELDS)[number]["key"],
    lang: "hy" | "en" | "ru",
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: { ...prev[key], [lang]: value },
    }));
  };

  const handleSave = async () => {
    await updateAboutUs({
      variables: {
        input: {
          title: form.title,
          historyTitle: form.historyTitle,
          historyText: form.historyText,
          whyUsTitle: form.whyUsTitle,
          whyUsText: form.whyUsText,
          privacyTitle: form.privacyTitle,
          privacyText: form.privacyText,
        },
      },
    });
  };

  if (loading && !data) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-destructive">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">About Us (Մեր մասին)</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
      <p className="text-muted-foreground text-sm">
        Edit the content of the public &quot;About Us&quot; page. This is
        separate from translations. Values for Armenian (hy), English (en), and
        Russian (ru).
      </p>
      <div className="space-y-6">
        {FIELDS.map(({ key, label, textarea }) => (
          <Card key={key} className="p-4">
            <Label className="font-medium text-sm text-muted-foreground block mb-3">
              {label}
            </Label>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <Label className="text-xs text-muted-foreground">Հայ (hy)</Label>
                {textarea ? (
                  <Textarea
                    value={form[key]?.hy ?? ""}
                    onChange={(e) => update(key, "hy", e.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                ) : (
                  <Input
                    value={form[key]?.hy ?? ""}
                    onChange={(e) => update(key, "hy", e.target.value)}
                    className="mt-1"
                  />
                )}
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">En</Label>
                {textarea ? (
                  <Textarea
                    value={form[key]?.en ?? ""}
                    onChange={(e) => update(key, "en", e.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                ) : (
                  <Input
                    value={form[key]?.en ?? ""}
                    onChange={(e) => update(key, "en", e.target.value)}
                    className="mt-1"
                  />
                )}
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Ru</Label>
                {textarea ? (
                  <Textarea
                    value={form[key]?.ru ?? ""}
                    onChange={(e) => update(key, "ru", e.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                ) : (
                  <Input
                    value={form[key]?.ru ?? ""}
                    onChange={(e) => update(key, "ru", e.target.value)}
                    className="mt-1"
                  />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
