"use client";

import * as React from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  HOME_SECTION_ADMIN,
  COMPLETED_WORKS_ADMIN,
} from "@/app/api/query";
import {
  UPDATE_HOME_SECTION,
  CREATE_COMPLETED_WORK,
  UPDATE_COMPLETED_WORK,
  REMOVE_COMPLETED_WORK,
} from "@/app/api/mutations";

type LangBlock = { hy?: string | null; en?: string | null; ru?: string | null };

type HomeSectionAdmin = {
  id: string;
  ourWorksTitle: LangBlock;
  completedWorksTitle: LangBlock;
  selectedOnMapLabel: LangBlock;
  newProjectCta: LangBlock;
  completedWorksMapTitle: LangBlock;
};

type CompletedWorkItem = {
  id: string;
  name: LangBlock;
  address: LangBlock;
  mapUrl: string;
  order: number;
  lat?: number | null;
  lng?: number | null;
  image?: string | null;
};

const SECTION_FIELDS = [
  { key: "ourWorksTitle", label: "Our works section title" },
  { key: "completedWorksTitle", label: "Completed works section title" },
  { key: "selectedOnMapLabel", label: "Selected on map label" },
  { key: "newProjectCta", label: "New project CTA link text" },
  { key: "completedWorksMapTitle", label: "Map iframe title (Կատարած աշխատանքների վայրեր)" },
] as const;

export default function OurWorksPage() {
  const { data: sectionData, loading: sectionLoading, refetch: refetchSection } = useQuery<{
    homeSectionAdmin: HomeSectionAdmin;
  }>(HOME_SECTION_ADMIN);
  const { data: worksData, loading: worksLoading, refetch: refetchWorks } = useQuery<{
    completedWorksAdmin: CompletedWorkItem[];
  }>(COMPLETED_WORKS_ADMIN);

  const [updateHomeSection, { loading: savingSection }] = useMutation(
    UPDATE_HOME_SECTION,
    { onCompleted: () => refetchSection() },
  );
  const [createWork] = useMutation(CREATE_COMPLETED_WORK, {
    onCompleted: () => refetchWorks(),
  });
  const [updateWork] = useMutation(UPDATE_COMPLETED_WORK, {
    onCompleted: () => refetchWorks(),
  });
  const [removeWork] = useMutation(REMOVE_COMPLETED_WORK, {
    onCompleted: () => refetchWorks(),
  });

  const section = sectionData?.homeSectionAdmin;
  const works = worksData?.completedWorksAdmin ?? [];

  const [sectionForm, setSectionForm] = React.useState<
    Record<(typeof SECTION_FIELDS)[number]["key"], { hy: string; en: string; ru: string }>
  >({
    ourWorksTitle: { hy: "", en: "", ru: "" },
    completedWorksTitle: { hy: "", en: "", ru: "" },
    selectedOnMapLabel: { hy: "", en: "", ru: "" },
    newProjectCta: { hy: "", en: "", ru: "" },
    completedWorksMapTitle: { hy: "", en: "", ru: "" },
  });

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [addForm, setAddForm] = React.useState({
    name: { hy: "", en: "", ru: "" },
    address: { hy: "", en: "", ru: "" },
    lat: "" as string | number,
    lng: "" as string | number,
    imageFile: null as File | null,
  });
  const [editForm, setEditForm] = React.useState({
    name: { hy: "", en: "", ru: "" },
    address: { hy: "", en: "", ru: "" },
    lat: "" as string | number,
    lng: "" as string | number,
    image: "",
  });
  const [editImageFile, setEditImageFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    if (!section) return;
    setSectionForm({
      ourWorksTitle: {
        hy: section.ourWorksTitle?.hy ?? "",
        en: section.ourWorksTitle?.en ?? "",
        ru: section.ourWorksTitle?.ru ?? "",
      },
      completedWorksTitle: {
        hy: section.completedWorksTitle?.hy ?? "",
        en: section.completedWorksTitle?.en ?? "",
        ru: section.completedWorksTitle?.ru ?? "",
      },
      selectedOnMapLabel: {
        hy: section.selectedOnMapLabel?.hy ?? "",
        en: section.selectedOnMapLabel?.en ?? "",
        ru: section.selectedOnMapLabel?.ru ?? "",
      },
      newProjectCta: {
        hy: section.newProjectCta?.hy ?? "",
        en: section.newProjectCta?.en ?? "",
        ru: section.newProjectCta?.ru ?? "",
      },
      completedWorksMapTitle: {
        hy: section.completedWorksMapTitle?.hy ?? "",
        en: section.completedWorksMapTitle?.en ?? "",
        ru: section.completedWorksMapTitle?.ru ?? "",
      },
    });
  }, [section]);

  const saveSection = async () => {
    await updateHomeSection({
      variables: {
        input: {
          ourWorksTitle: sectionForm.ourWorksTitle,
          completedWorksTitle: sectionForm.completedWorksTitle,
          selectedOnMapLabel: sectionForm.selectedOnMapLabel,
          newProjectCta: sectionForm.newProjectCta,
          completedWorksMapTitle: sectionForm.completedWorksMapTitle,
        },
      },
    });
  };

  const num = (v: string | number) => {
    const n = typeof v === "string" ? parseFloat(v) : v;
    return Number.isFinite(n) ? n : null;
  };

  const addWork = async () => {
    await createWork({
      variables: {
        input: {
          name: addForm.name,
          address: addForm.address,
          lat: num(addForm.lat),
          lng: num(addForm.lng),
          uploadedImage: addForm.imageFile ?? undefined,
        },
      },
    });
    setAddForm({
      name: { hy: "", en: "", ru: "" },
      address: { hy: "", en: "", ru: "" },
      lat: "",
      lng: "",
      imageFile: null,
    });
  };

  const startEdit = (w: CompletedWorkItem) => {
    setEditingId(w.id);
    setEditImageFile(null);
    setEditForm({
      name: { hy: w.name?.hy ?? "", en: w.name?.en ?? "", ru: w.name?.ru ?? "" },
      address: { hy: w.address?.hy ?? "", en: w.address?.en ?? "", ru: w.address?.ru ?? "" },
      lat: w.lat ?? "",
      lng: w.lng ?? "",
      image: w.image ?? "",
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await updateWork({
      variables: {
        id: editingId,
        input: {
          name: editForm.name,
          address: editForm.address,
          lat: num(editForm.lat),
          lng: num(editForm.lng),
          uploadedImage: editImageFile ?? undefined,
        },
      },
    });
    setEditingId(null);
    setEditImageFile(null);
  };

  const deleteWork = async (id: string) => {
    if (!confirm("Delete this work?")) return;
    await removeWork({ variables: { id } });
  };

  if (sectionLoading && !section) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Our Works (Մեր աշխատանքները)</h1>

      {/* Section titles */}
      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">Home page section titles</h2>
        <div className="space-y-4">
          {SECTION_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <Label className="text-sm text-muted-foreground">{label}</Label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <Input
                  placeholder="Hy"
                  value={sectionForm[key]?.hy ?? ""}
                  onChange={(e) =>
                    setSectionForm((prev) => ({
                      ...prev,
                      [key]: { ...prev[key], hy: e.target.value },
                    }))
                  }
                />
                <Input
                  placeholder="En"
                  value={sectionForm[key]?.en ?? ""}
                  onChange={(e) =>
                    setSectionForm((prev) => ({
                      ...prev,
                      [key]: { ...prev[key], en: e.target.value },
                    }))
                  }
                />
                <Input
                  placeholder="Ru"
                  value={sectionForm[key]?.ru ?? ""}
                  onChange={(e) =>
                    setSectionForm((prev) => ({
                      ...prev,
                      [key]: { ...prev[key], ru: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          ))}
        </div>
        <Button
          className="mt-4"
          onClick={saveSection}
          disabled={savingSection}
        >
          {savingSection ? "Saving…" : "Save section titles"}
        </Button>
      </Card>

      {/* Completed works list */}
      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">Completed works (map items)</h2>

        {/* Add new */}
        <div className="rounded-lg border p-4 mb-6 bg-muted/30">
          <Label className="text-sm font-medium block mb-3">Add work</Label>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label className="text-xs">Name (hy, en, ru)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  placeholder="Hy"
                  value={addForm.name.hy}
                  onChange={(e) =>
                    setAddForm((prev) => ({
                      ...prev,
                      name: { ...prev.name, hy: e.target.value },
                    }))
                  }
                />
                <Input
                  placeholder="En"
                  value={addForm.name.en}
                  onChange={(e) =>
                    setAddForm((prev) => ({
                      ...prev,
                      name: { ...prev.name, en: e.target.value },
                    }))
                  }
                />
                <Input
                  placeholder="Ru"
                  value={addForm.name.ru}
                  onChange={(e) =>
                    setAddForm((prev) => ({
                      ...prev,
                      name: { ...prev.name, ru: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Address (hy, en, ru)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  placeholder="Hy"
                  value={addForm.address.hy}
                  onChange={(e) =>
                    setAddForm((prev) => ({
                      ...prev,
                      address: { ...prev.address, hy: e.target.value },
                    }))
                  }
                />
                <Input
                  placeholder="En"
                  value={addForm.address.en}
                  onChange={(e) =>
                    setAddForm((prev) => ({
                      ...prev,
                      address: { ...prev.address, en: e.target.value },
                    }))
                  }
                />
                <Input
                  placeholder="Ru"
                  value={addForm.address.ru}
                  onChange={(e) =>
                    setAddForm((prev) => ({
                      ...prev,
                      address: { ...prev.address, ru: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Latitude (քարտեզի մարկերի համար)</Label>
              <Input
                type="number"
                step="any"
                className="mt-1"
                placeholder="40.1872"
                value={addForm.lat}
                onChange={(e) =>
                  setAddForm((prev) => ({ ...prev, lat: e.target.value }))
                }
              />
            </div>
            <div>
              <Label className="text-xs">Longitude (քարտեզի մարկերի համար)</Label>
              <Input
                type="number"
                step="any"
                className="mt-1"
                placeholder="44.5152"
                value={addForm.lng}
                onChange={(e) =>
                  setAddForm((prev) => ({ ...prev, lng: e.target.value }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs">Այս խաղահրապարակի նկար (քարտեզի մարկերում ցուցադրվող, ֆայլով)</Label>
              <label className="mt-1 flex flex-col cursor-pointer">
                <div className="border border-dashed rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center min-h-[100px] w-full max-w-[200px]">
                  {addForm.imageFile ? (
                    <img
                      src={URL.createObjectURL(addForm.imageFile)}
                      alt="Preview"
                      className="object-cover w-full h-full min-h-[100px]"
                    />
                  ) : (
                    <span className="text-muted-foreground text-sm p-2 text-center">
                      Ընտրել նկար
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setAddForm((prev) => ({ ...prev, imageFile: f ?? null }));
                  }}
                  aria-label="Խաղահրապարակի նկար"
                />
              </label>
            </div>
          </div>
          <Button className="mt-3" onClick={addWork} size="sm">
            Add work
          </Button>
        </div>

        {worksLoading && !works.length ? (
          <p className="text-muted-foreground">Loading works…</p>
        ) : (
          <ul className="space-y-3">
            {works.map((w) => (
              <li
                key={w.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-4"
              >
                {editingId === w.id ? (
                  <div className="flex-1 grid gap-2 md:grid-cols-2">
                    <Input
                      placeholder="Name (en)"
                      value={editForm.name.en}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          name: { ...prev.name, en: e.target.value },
                        }))
                      }
                    />
                    <Input
                      placeholder="Address (en)"
                      value={editForm.address.en}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          address: { ...prev.address, en: e.target.value },
                        }))
                      }
                    />
                    <Input
                      type="number"
                      step="any"
                      placeholder="Latitude"
                      value={editForm.lat}
                      onChange={(e) =>
                        setEditForm((prev) => ({ ...prev, lat: e.target.value }))
                      }
                    />
                    <Input
                      type="number"
                      step="any"
                      placeholder="Longitude"
                      value={editForm.lng}
                      onChange={(e) =>
                        setEditForm((prev) => ({ ...prev, lng: e.target.value }))
                      }
                    />
                    <div className="md:col-span-2">
                      <Label className="text-xs">Այս խաղահրապարակի նկար (ֆայլով)</Label>
                      <label className="mt-1 flex flex-col cursor-pointer max-w-[200px]">
                        <div className="border border-dashed rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center min-h-[100px] w-full">
                          {editImageFile ? (
                            <img
                              src={URL.createObjectURL(editImageFile)}
                              alt="Preview"
                              className="object-cover w-full h-full min-h-[100px]"
                            />
                          ) : editForm.image ? (
                            <img
                              src={editForm.image}
                              alt="Current"
                              className="object-cover w-full h-full min-h-[100px]"
                            />
                          ) : (
                            <span className="text-muted-foreground text-sm p-2 text-center">
                              Ընտրել նկար
                            </span>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            setEditImageFile(e.target.files?.[0] ?? null);
                          }}
                          aria-label="Խաղահրապարակի նկար"
                        />
                      </label>
                    </div>
                    <div className="md:col-span-2 flex gap-2">
                      <Button size="sm" onClick={saveEdit}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="font-medium">
                        {w.name?.en || w.name?.hy || w.name?.ru || "—"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {w.address?.en || w.address?.hy || w.address?.ru || "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {w.lat != null && w.lng != null
                          ? `Քարտեզ: ${w.lat}, ${w.lng}`
                          : "Քարտեզի կոորդ.—"}
                        {w.image ? " · Նկար ✓" : ""}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(w)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteWork(w.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
