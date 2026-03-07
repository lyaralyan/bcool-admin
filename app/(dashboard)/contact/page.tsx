"use client";

import * as React from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CONTACT_ADMIN } from "@/app/api/query";
import { UPDATE_CONTACT } from "@/app/api/mutations";

type LangBlock = { hy?: string | null; en?: string | null; ru?: string | null };

type ContactAdmin = {
  id: string;
  title: LangBlock;
  mapTitle: LangBlock;
  ctaHeading: LangBlock;
  address: LangBlock;
  description: LangBlock;
  email: string;
  phone: string;
  mapEmbedUrl: string;
};

const LANG_FIELDS = [
  { key: "title", label: "Page title" },
  { key: "mapTitle", label: "Map iframe title" },
  { key: "ctaHeading", label: "Contact heading" },
  { key: "address", label: "Address" },
  { key: "description", label: "Description (below contact info)" },
] as const;

export default function ContactPage() {
  const { data, loading, error, refetch } = useQuery<{
    contactAdmin: ContactAdmin;
  }>(CONTACT_ADMIN);
  const [updateContact, { loading: saving }] = useMutation(UPDATE_CONTACT, {
    onCompleted: () => refetch(),
  });

  const [langForm, setLangForm] = React.useState<
    Record<(typeof LANG_FIELDS)[number]["key"], { hy: string; en: string; ru: string }>
  >({
    title: { hy: "", en: "", ru: "" },
    mapTitle: { hy: "", en: "", ru: "" },
    ctaHeading: { hy: "", en: "", ru: "" },
    address: { hy: "", en: "", ru: "" },
    description: { hy: "", en: "", ru: "" },
  });
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [mapEmbedUrl, setMapEmbedUrl] = React.useState("");

  const admin = data?.contactAdmin;

  React.useEffect(() => {
    if (!admin) return;
    const next: typeof langForm = {
      title: { hy: admin.title?.hy ?? "", en: admin.title?.en ?? "", ru: admin.title?.ru ?? "" },
      mapTitle: { hy: admin.mapTitle?.hy ?? "", en: admin.mapTitle?.en ?? "", ru: admin.mapTitle?.ru ?? "" },
      ctaHeading: { hy: admin.ctaHeading?.hy ?? "", en: admin.ctaHeading?.en ?? "", ru: admin.ctaHeading?.ru ?? "" },
      address: { hy: admin.address?.hy ?? "", en: admin.address?.en ?? "", ru: admin.address?.ru ?? "" },
      description: { hy: admin.description?.hy ?? "", en: admin.description?.en ?? "", ru: admin.description?.ru ?? "" },
    };
    setLangForm(next);
    setEmail(admin.email ?? "");
    setPhone(admin.phone ?? "");
    setMapEmbedUrl(admin.mapEmbedUrl ?? "");
  }, [admin]);

  const updateLang = (
    key: (typeof LANG_FIELDS)[number]["key"],
    lang: "hy" | "en" | "ru",
    value: string,
  ) => {
    setLangForm((prev) => ({
      ...prev,
      [key]: { ...prev[key], [lang]: value },
    }));
  };

  const handleSave = async () => {
    await updateContact({
      variables: {
        input: {
          title: langForm.title,
          mapTitle: langForm.mapTitle,
          ctaHeading: langForm.ctaHeading,
          address: langForm.address,
          description: langForm.description,
          email: email || null,
          phone: phone || null,
          mapEmbedUrl: mapEmbedUrl || null,
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
        <h1 className="text-2xl font-semibold">Contact (Կապ մեզ հետ)</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
      <p className="text-muted-foreground text-sm">
        Edit contact page content and map. Email, phone, and map embed URL are
        single values (not per language).
      </p>

      <Card className="p-4">
        <Label className="font-medium block mb-3">Email</Label>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="info@example.com"
        />
      </Card>
      <Card className="p-4">
        <Label className="font-medium block mb-3">Phone</Label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+374 10 123 456"
        />
      </Card>
      <Card className="p-4">
        <Label className="font-medium block mb-3">Map embed URL</Label>
        <Input
          value={mapEmbedUrl}
          onChange={(e) => setMapEmbedUrl(e.target.value)}
          placeholder="https://www.google.com/maps/embed?pb=..."
        />
      </Card>

      {LANG_FIELDS.map(({ key, label }) => (
        <Card key={key} className="p-4">
          <Label className="font-medium text-sm text-muted-foreground block mb-3">
            {label}
          </Label>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <Label className="text-xs text-muted-foreground">Հայ</Label>
              {key === "description" ? (
                <Textarea
                  value={langForm[key]?.hy ?? ""}
                  onChange={(e) => updateLang(key, "hy", e.target.value)}
                  rows={3}
                  className="mt-1"
                />
              ) : (
                <Input
                  value={langForm[key]?.hy ?? ""}
                  onChange={(e) => updateLang(key, "hy", e.target.value)}
                  className="mt-1"
                />
              )}
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">En</Label>
              {key === "description" ? (
                <Textarea
                  value={langForm[key]?.en ?? ""}
                  onChange={(e) => updateLang(key, "en", e.target.value)}
                  rows={3}
                  className="mt-1"
                />
              ) : (
                <Input
                  value={langForm[key]?.en ?? ""}
                  onChange={(e) => updateLang(key, "en", e.target.value)}
                  className="mt-1"
                />
              )}
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Ru</Label>
              {key === "description" ? (
                <Textarea
                  value={langForm[key]?.ru ?? ""}
                  onChange={(e) => updateLang(key, "ru", e.target.value)}
                  rows={3}
                  className="mt-1"
                />
              ) : (
                <Input
                  value={langForm[key]?.ru ?? ""}
                  onChange={(e) => updateLang(key, "ru", e.target.value)}
                  className="mt-1"
                />
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
