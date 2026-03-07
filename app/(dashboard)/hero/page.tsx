"use client";

import * as React from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { HERO_ADMIN } from "@/app/api/query";
import { UPDATE_HERO } from "@/app/api/mutations";

type LangBlock = { hy?: string | null; en?: string | null; ru?: string | null };

type HeroAdmin = {
  id: string;
  title: LangBlock;
  subtitle: LangBlock;
  ctaText: LangBlock;
  ctaLink: string;
  image: string;
  card1Title: LangBlock;
  card1Subtitle: LangBlock;
  card1Image: string;
  card2Title: LangBlock;
  card2Subtitle: LangBlock;
  card2Image: string;
};

const LANG_FIELDS = [
  { key: "title", label: "Hero title (Ստեղծում ենք անվտանգ խաղահրապարակներ)" },
  { key: "subtitle", label: "Hero subtitle" },
  { key: "ctaText", label: "CTA button text" },
] as const;

function ImageUploadBlock({
  label,
  file,
  existingUrl,
  onFileChange,
}: {
  label: string;
  file: File | null;
  existingUrl: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const previewUrl = file ? URL.createObjectURL(file) : existingUrl || null;
  return (
    <div>
      <Label className="font-medium block mb-2">{label}</Label>
      <label className="flex flex-col cursor-pointer">
        <div className="border border-dashed rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center min-h-[140px] w-full max-w-xs">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={label}
              className="object-contain w-full h-full min-h-[140px]"
            />
          ) : (
            <span className="text-muted-foreground text-sm p-4 text-center">
              Ընտրել ֆայլ
            </span>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
          aria-label={label}
        />
      </label>
    </div>
  );
}

export default function HeroPage() {
  const { data, loading, error, refetch } = useQuery<{
    heroAdmin: HeroAdmin;
  }>(HERO_ADMIN);
  const [updateHero, { loading: saving }] = useMutation(UPDATE_HERO, {
    onCompleted: () => {
      refetch();
      setHeroImageFile(null);
      setCard1ImageFile(null);
      setCard2ImageFile(null);
    },
  });

  const [langForm, setLangForm] = React.useState<
    Record<(typeof LANG_FIELDS)[number]["key"], { hy: string; en: string; ru: string }>
  >({
    title: { hy: "", en: "", ru: "" },
    subtitle: { hy: "", en: "", ru: "" },
    ctaText: { hy: "", en: "", ru: "" },
  });
  const [ctaLink, setCtaLink] = React.useState("");
  const [heroImageFile, setHeroImageFile] = React.useState<File | null>(null);
  const [card1Title, setCard1Title] = React.useState({ hy: "", en: "", ru: "" });
  const [card1Subtitle, setCard1Subtitle] = React.useState({ hy: "", en: "", ru: "" });
  const [card1ImageFile, setCard1ImageFile] = React.useState<File | null>(null);
  const [card2Title, setCard2Title] = React.useState({ hy: "", en: "", ru: "" });
  const [card2Subtitle, setCard2Subtitle] = React.useState({ hy: "", en: "", ru: "" });
  const [card2ImageFile, setCard2ImageFile] = React.useState<File | null>(null);

  const admin = data?.heroAdmin;

  React.useEffect(() => {
    if (!admin) return;
    setLangForm({
      title: { hy: admin.title?.hy ?? "", en: admin.title?.en ?? "", ru: admin.title?.ru ?? "" },
      subtitle: { hy: admin.subtitle?.hy ?? "", en: admin.subtitle?.en ?? "", ru: admin.subtitle?.ru ?? "" },
      ctaText: { hy: admin.ctaText?.hy ?? "", en: admin.ctaText?.en ?? "", ru: admin.ctaText?.ru ?? "" },
    });
    setCtaLink(admin.ctaLink ?? "");
    setCard1Title({ hy: admin.card1Title?.hy ?? "", en: admin.card1Title?.en ?? "", ru: admin.card1Title?.ru ?? "" });
    setCard1Subtitle({ hy: admin.card1Subtitle?.hy ?? "", en: admin.card1Subtitle?.en ?? "", ru: admin.card1Subtitle?.ru ?? "" });
    setCard2Title({ hy: admin.card2Title?.hy ?? "", en: admin.card2Title?.en ?? "", ru: admin.card2Title?.ru ?? "" });
    setCard2Subtitle({ hy: admin.card2Subtitle?.hy ?? "", en: admin.card2Subtitle?.en ?? "", ru: admin.card2Subtitle?.ru ?? "" });
  }, [admin]);

  const handleSave = async () => {
    await updateHero({
      variables: {
        input: {
          title: langForm.title,
          subtitle: langForm.subtitle,
          ctaText: langForm.ctaText,
          ctaLink: ctaLink || null,
          uploadedImage: heroImageFile ?? undefined,
          card1Title,
          card1Subtitle,
          uploadedCard1Image: card1ImageFile ?? undefined,
          card2Title,
          card2Subtitle,
          uploadedCard2Image: card2ImageFile ?? undefined,
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
        <h1 className="text-2xl font-semibold">Hero (Գլխավոր բաժին)</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
      <p className="text-muted-foreground text-sm">
        Գլխավոր էջի hero բաժին – title, subtitle, CTA, նկարներ (ֆայլով):
      </p>

      {LANG_FIELDS.map(({ key, label }) => (
        <Card key={key} className="p-4">
          <Label className="font-medium text-sm text-muted-foreground block mb-3">{label}</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              placeholder="Hy"
              value={langForm[key]?.hy ?? ""}
              onChange={(e) => setLangForm((prev) => ({ ...prev, [key]: { ...prev[key], hy: e.target.value } }))}
            />
            <Input
              placeholder="En"
              value={langForm[key]?.en ?? ""}
              onChange={(e) => setLangForm((prev) => ({ ...prev, [key]: { ...prev[key], en: e.target.value } }))}
            />
            <Input
              placeholder="Ru"
              value={langForm[key]?.ru ?? ""}
              onChange={(e) => setLangForm((prev) => ({ ...prev, [key]: { ...prev[key], ru: e.target.value } }))}
            />
          </div>
        </Card>
      ))}

      <Card className="p-4">
        <Label className="font-medium block mb-2">CTA link</Label>
        <Input value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} placeholder="/products" />
      </Card>

      <Card className="p-4">
        <ImageUploadBlock
          label="Hero նկար"
          file={heroImageFile}
          existingUrl={admin?.image ?? ""}
          onFileChange={(e) => setHeroImageFile(e.target.files?.[0] ?? null)}
        />
      </Card>

      <Card className="p-4">
        <Label className="font-medium block mb-3">Card 1 (խաղահրապարակներ)</Label>
        <div className="grid gap-2 mb-4">
          <div className="grid grid-cols-3 gap-2">
            <Input placeholder="Title Hy" value={card1Title.hy} onChange={(e) => setCard1Title((p) => ({ ...p, hy: e.target.value }))} />
            <Input placeholder="Title En" value={card1Title.en} onChange={(e) => setCard1Title((p) => ({ ...p, en: e.target.value }))} />
            <Input placeholder="Title Ru" value={card1Title.ru} onChange={(e) => setCard1Title((p) => ({ ...p, ru: e.target.value }))} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Input placeholder="Subtitle Hy" value={card1Subtitle.hy} onChange={(e) => setCard1Subtitle((p) => ({ ...p, hy: e.target.value }))} />
            <Input placeholder="Subtitle En" value={card1Subtitle.en} onChange={(e) => setCard1Subtitle((p) => ({ ...p, en: e.target.value }))} />
            <Input placeholder="Subtitle Ru" value={card1Subtitle.ru} onChange={(e) => setCard1Subtitle((p) => ({ ...p, ru: e.target.value }))} />
          </div>
        </div>
        <ImageUploadBlock
          label="Card 1 նկար"
          file={card1ImageFile}
          existingUrl={admin?.card1Image ?? ""}
          onFileChange={(e) => setCard1ImageFile(e.target.files?.[0] ?? null)}
        />
      </Card>

      <Card className="p-4">
        <Label className="font-medium block mb-3">Card 2 (աքսեսուարներ)</Label>
        <div className="grid gap-2 mb-4">
          <div className="grid grid-cols-3 gap-2">
            <Input placeholder="Title Hy" value={card2Title.hy} onChange={(e) => setCard2Title((p) => ({ ...p, hy: e.target.value }))} />
            <Input placeholder="Title En" value={card2Title.en} onChange={(e) => setCard2Title((p) => ({ ...p, en: e.target.value }))} />
            <Input placeholder="Title Ru" value={card2Title.ru} onChange={(e) => setCard2Title((p) => ({ ...p, ru: e.target.value }))} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Input placeholder="Subtitle Hy" value={card2Subtitle.hy} onChange={(e) => setCard2Subtitle((p) => ({ ...p, hy: e.target.value }))} />
            <Input placeholder="Subtitle En" value={card2Subtitle.en} onChange={(e) => setCard2Subtitle((p) => ({ ...p, en: e.target.value }))} />
            <Input placeholder="Subtitle Ru" value={card2Subtitle.ru} onChange={(e) => setCard2Subtitle((p) => ({ ...p, ru: e.target.value }))} />
          </div>
        </div>
        <ImageUploadBlock
          label="Card 2 նկար"
          file={card2ImageFile}
          existingUrl={admin?.card2Image ?? ""}
          onFileChange={(e) => setCard2ImageFile(e.target.files?.[0] ?? null)}
        />
      </Card>
    </div>
  );
}
