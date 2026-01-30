"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  CREATE_CATEGORY,
  REMOVE_CATEGORY,
  UPDATE_CATEGORY,
} from "@/app/api/mutations";
import { GET_CATEGORIES } from "@/app/api/query";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const slugify = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
};

const PreviewBlock = ({
  label,
  file,
  existingUrl,
  onFileChange,
  width,
  height,
}: {
  label: string;
  file: File | null;
  existingUrl: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  width: number;
  height: number;
}) => {
  const previewUrl = file ? URL.createObjectURL(file) : existingUrl;

  return (
    <label className="flex flex-col items-center cursor-pointer">
      <span className="mb-1 font-medium">{label}</span>
      <div
        className={`border border-dashed rounded-lg hover:bg-muted flex items-center justify-center overflow-hidden relative`}
        style={{ width, height }}>
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={`${label} Preview`}
            width={width}
            height={height}
            className="object-contain"
            unoptimized
          />
        ) : (
          <span className="text-muted-foreground select-none text-center">
            Upload {label.toLowerCase()}
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
  );
};

const Categories = () => {
  const { data, loading, error, refetch } =
    useQuery<CategoriesQueryResponse>(GET_CATEGORIES);
  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY, {
    onCompleted: () => {
      setTitle({ hy: "", en: "", ru: "" });
      setDescription({ hy: "", en: "", ru: "" });
      setIconFile(null);
      setImageFile(null);
      refetch();
    },
  });
  const [removeCategory] = useMutation(REMOVE_CATEGORY, {
    onCompleted: () => {
      refetch();
    },
  });
  const [updateCategory] = useMutation(UPDATE_CATEGORY, {
    onCompleted: () => {
      refetch();
      setEditingCategoryId(null);
      setEditIcon(null);
      setEditImage(null);
    },
  });

  const [title, setTitle] = React.useState<MultiLang>({
    hy: "",
    en: "",
    ru: "",
  });
  const [description, setDescription] = React.useState<MultiLang>({
    hy: "",
    en: "",
    ru: "",
  });
  const [iconFile, setIconFile] = React.useState<File | null>(null);
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const [editingCategoryId, setEditingCategoryId] = React.useState<
    string | null
  >(null);
  const [editTitle, setEditTitle] = React.useState<MultiLang>({
    hy: "",
    en: "",
    ru: "",
  });
  const [editDescription, setEditDescription] = React.useState<MultiLang>({
    hy: "",
    en: "",
    ru: "",
  });
  type Lang = "hy" | "en" | "ru";
  type MultiLang = {
    hy: string;
    en: string;
    ru: string;
  };

  function onLangChange(
    setter: React.Dispatch<React.SetStateAction<MultiLang>>,
    lang: Lang,
    value: string,
  ) {
    setter((prev) => ({
      ...prev,
      [lang]: value,
    }));
  }
  const [editIcon, setEditIcon] = React.useState<string | null>(null);
  const [editImage, setEditImage] = React.useState<string | null>(null);
  const [editIconFile, setEditIconFile] = React.useState<File | null>(null);
  const [editImageFile, setEditImageFile] = React.useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.en.trim() && !title.hy.trim()) return;
    const slug = slugify(title.en || title.hy);
    await createCategory({
      variables: {
        input: {
          slug,
          title,
          description,
          uploadedIcon: iconFile,
          uploadedImage: imageFile,
        },
      },
    });
  };

  const handleDelete = async (id: string) => {
    await removeCategory({ variables: { id } });
  };

  const startEditing = (cat: {
    id: string;
    title: { hy: string; en: string; ru: string };
    description?: { hy: string; en: string; ru: string } | null;
    icon?: string | null;
    image?: string | null;
  }) => {
    setEditingCategoryId(cat.id);
    setEditTitle(cat.title);
    setEditDescription(cat.description ?? { hy: "", en: "", ru: "" });
    setEditIcon(cat.icon ?? null);
    setEditImage(cat.image ?? null);
    setEditIconFile(null);
    setEditImageFile(null);
  };

  const cancelEditing = () => {
    setEditingCategoryId(null);
    setEditTitle({ hy: "", en: "", ru: "" });
    setEditDescription({ hy: "", en: "", ru: "" });
    setEditIcon(null);
    setEditImage(null);
    setEditIconFile(null);
    setEditImageFile(null);
  };

  const saveEditing = async () => {
    if (!editTitle.en.trim() && !editTitle.hy.trim()) return;
    const slug = slugify(editTitle.en || editTitle.hy);
    await updateCategory({
      variables: {
        id: editingCategoryId,
        input: {
          title: editTitle,
          description: editDescription,
          slug,
          uploadedIcon: editIconFile ?? undefined,
          uploadedImage: editImageFile ?? undefined,
        },
      },
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    console.log("📢 [page.tsx:40]", data);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full px-2 mt-8 space-y-6">
      <Card className={"px-4 py-4"}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4 max-w-md">
          <div className="flex flex-col space-y-2">
            <div className="space-y-2">
              <Input
                placeholder="Title (HY)"
                value={title.hy}
                onChange={(e) => onLangChange(setTitle, "hy", e.target.value)}
                disabled={creating}
                aria-label="Category Title HY"
              />
              <Input
                placeholder="Title (EN)"
                value={title.en}
                onChange={(e) => onLangChange(setTitle, "en", e.target.value)}
                disabled={creating}
                aria-label="Category Title EN"
              />
              <Input
                placeholder="Title (RU)"
                value={title.ru}
                onChange={(e) => onLangChange(setTitle, "ru", e.target.value)}
                disabled={creating}
                aria-label="Category Title RU"
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Description (HY)"
                value={description.hy}
                onChange={(e) =>
                  onLangChange(setDescription, "hy", e.target.value)
                }
                disabled={creating}
                aria-label="Category Description HY"
              />
              <Input
                placeholder="Description (EN)"
                value={description.en}
                onChange={(e) =>
                  onLangChange(setDescription, "en", e.target.value)
                }
                disabled={creating}
                aria-label="Category Description EN"
              />
              <Input
                placeholder="Description (RU)"
                value={description.ru}
                onChange={(e) =>
                  onLangChange(setDescription, "ru", e.target.value)
                }
                disabled={creating}
                aria-label="Category Description RU"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <PreviewBlock
              label="Icon"
              file={iconFile}
              existingUrl={null}
              onFileChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setIconFile(e.target.files[0]);
                } else {
                  setIconFile(null);
                }
              }}
              width={64}
              height={64}
            />
            <PreviewBlock
              label="Image"
              file={imageFile}
              existingUrl={null}
              onFileChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                } else {
                  setImageFile(null);
                }
              }}
              width={160}
              height={100}
            />
          </div>
          <Button
            type="submit"
            disabled={creating}
            className="self-start">
            {creating ? "Adding..." : "Add"}
          </Button>
        </form>
      </Card>

      <Card className={"px-4 py-4"}>
        <h2 className="mb-4 text-lg font-semibold">Categories</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">Error loading categories.</p>}
        {!loading && !error && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Media</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.categories?.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    {editingCategoryId === cat.id ? (
                      <div className="space-y-1">
                        <Input
                          value={editTitle.hy}
                          onChange={(e) =>
                            onLangChange(setEditTitle, "hy", e.target.value)
                          }
                          placeholder="HY"
                        />
                        <Input
                          value={editTitle.en}
                          onChange={(e) =>
                            onLangChange(setEditTitle, "en", e.target.value)
                          }
                          placeholder="EN"
                        />
                        <Input
                          value={editTitle.ru}
                          onChange={(e) =>
                            onLangChange(setEditTitle, "ru", e.target.value)
                          }
                          placeholder="RU"
                        />
                      </div>
                    ) : (
                      cat.title.en || cat.title.hy
                    )}
                  </TableCell>
                  <TableCell>{cat.slug ?? "-"}</TableCell>
                  <TableCell>
                    {editingCategoryId === cat.id ? (
                      <div className="space-y-1">
                        <Input
                          value={editDescription.hy}
                          onChange={(e) =>
                            onLangChange(
                              setEditDescription,
                              "hy",
                              e.target.value,
                            )
                          }
                          placeholder="HY"
                        />
                        <Input
                          value={editDescription.en}
                          onChange={(e) =>
                            onLangChange(
                              setEditDescription,
                              "en",
                              e.target.value,
                            )
                          }
                          placeholder="EN"
                        />
                        <Input
                          value={editDescription.ru}
                          onChange={(e) =>
                            onLangChange(
                              setEditDescription,
                              "ru",
                              e.target.value,
                            )
                          }
                          placeholder="RU"
                        />
                      </div>
                    ) : (
                      cat.description?.en || cat.description?.hy || "-"
                    )}
                  </TableCell>

                  <TableCell className="space-x-2 flex items-center">
                    {editingCategoryId === cat.id ? (
                      <>
                        <label className="flex flex-col items-center cursor-pointer">
                          <span className="sr-only">Edit Icon</span>
                          <div className="border border-dashed rounded-lg hover:bg-muted flex items-center justify-center overflow-hidden relative w-16 h-16">
                            {editIconFile ? (
                              <Image
                                src={URL.createObjectURL(editIconFile)}
                                alt="Icon Preview"
                                width={64}
                                height={64}
                                className="object-contain"
                                unoptimized
                              />
                            ) : editIcon ? (
                              <Image
                                src={editIcon}
                                alt="Icon Preview"
                                width={64}
                                height={64}
                                className="object-contain"
                                unoptimized
                              />
                            ) : (
                              <span className="text-muted-foreground select-none text-center">
                                Upload <br /> icon
                              </span>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setEditIconFile(e.target.files[0]);
                              } else {
                                setEditIconFile(null);
                              }
                            }}
                            className="hidden"
                            aria-label="Edit Icon"
                          />
                        </label>
                        <label className="flex flex-col items-center cursor-pointer">
                          <span className="sr-only">Edit Image</span>
                          <div className="border border-dashed rounded-lg hover:bg-muted flex items-center justify-center overflow-hidden relative w-40 h-24">
                            {editImageFile ? (
                              <Image
                                src={URL.createObjectURL(editImageFile)}
                                alt="Image Preview"
                                width={160}
                                height={100}
                                className="object-contain"
                                unoptimized
                              />
                            ) : editImage ? (
                              <Image
                                src={editImage}
                                alt="Image Preview"
                                width={160}
                                height={100}
                                className="object-contain"
                                unoptimized
                              />
                            ) : (
                              <span className="text-muted-foreground select-none">
                                Upload image
                              </span>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setEditImageFile(e.target.files[0]);
                              } else {
                                setEditImageFile(null);
                              }
                            }}
                            className="hidden"
                            aria-label="Edit Image"
                          />
                        </label>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 border border-muted rounded-lg overflow-hidden">
                          {cat.icon ? (
                            <Image
                              src={cat.icon}
                              alt="Icon"
                              width={64}
                              height={64}
                              className="object-contain"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full bg-muted" />
                          )}
                        </div>
                        <div className="w-40 h-24 border border-muted rounded-lg overflow-hidden">
                          {cat.image ? (
                            <Image
                              src={cat.image}
                              alt="Image"
                              width={160}
                              height={100}
                              className="object-contain"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full bg-muted" />
                          )}
                        </div>
                      </>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary">
                      {cat.products?.length ?? 0}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(cat.createdAt)}</TableCell>
                  <TableCell>
                    {editingCategoryId === cat.id ? (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          className={"cursor-pointer mr-2"}
                          onClick={saveEditing}>
                          Save
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className={"cursor-pointer"}
                          onClick={cancelEditing}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          className={"cursor-pointer mr-2"}
                          onClick={() => startEditing(cat)}>
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className={"cursor-pointer"}
                          onClick={() => handleDelete(cat.id)}>
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default Categories;
