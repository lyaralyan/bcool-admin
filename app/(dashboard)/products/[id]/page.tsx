"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { GET_CATEGORIES, PRODUCT } from "@/app/api/query";
import { CREATE_PRODUCT, UPDATE_PRODUCT } from "@/app/api/mutations";
import { toast } from "sonner";

const currencies = ["AMD", "USD", "EUR"];
const ageRanges = ["0-2", "3-5", "6-8", "9-12", "13+"];
// Placeholder categories

const slugify = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
};

const Product = () => {
  const router = useRouter();
  const { id } = useParams();

  const isNew = id === "new";

  const {
    data: productData,
    loading: productLoading,
    error: productError,
    refetch: productRefetch,
  } = useQuery<{ product: Product; categories: Category[] }>(PRODUCT, {
    variables: { id },
    skip: isNew,
  });
  const {
    data: categoriesData,
    loading: categoriesLoading,
    // error: categoriesError,
    // refetch: categoriesRefetch,
  } = useQuery<{ categories: Category[] }>(GET_CATEGORIES);
  console.log("📢 [page.tsx:63]", categoriesData);

  const [createProduct, { loading: creating }] =
    useMutation<Product>(CREATE_PRODUCT);
  const [updateProduct, { loading: updating }] =
    useMutation<Product>(UPDATE_PRODUCT);

  const [form, setForm] = useState<{
    title: {
      hy: string;
      en: string;
      ru: string;
    };
    description: {
      hy: string;
      en: string;
      ru: string;
    };
    price: string;
    discount: string;
    currency: string;
    stock: string;
    material: string;
    weight: string;
    width: string;
    height: string;
    length: string;
    ageRange: string;
    color: string;
    isFeatured: boolean;
    isPublished: boolean;
    images: File[];
    category: string;
  }>({
    title: { hy: "", en: "", ru: "" },
    description: { hy: "", en: "", ru: "" },
    price: "",
    discount: "",
    currency: "USD",
    stock: "",
    material: "",
    weight: "",
    width: "",
    height: "",
    length: "",
    ageRange: "",
    color: "",
    isFeatured: false,
    isPublished: false,
    images: [] as File[],
    category: "",
  });

  const initializedRef = useRef(false);

  useEffect(() => {
    if (isNew) return;
    if (productData?.product && !initializedRef.current) {
      const p = productData.product;
      queueMicrotask(() => {
        setForm({
          title: p.title ?? { hy: "", en: "", ru: "" },
          description: p.description ?? { hy: "", en: "", ru: "" },
          price: p.price != null ? String(p.price) : "",
          discount: p.discount != null ? String(p.discount) : "",
          currency: p.currency || "AMD",
          stock: p.stock != null ? String(p.stock) : "",
          material: p.specifications?.material || "",
          weight:
            p.specifications?.weight != null
              ? String(p.specifications.weight)
              : "",
          width:
            p.specifications?.dimensions?.width != null
              ? String(p.specifications.dimensions.width)
              : "",
          height:
            p.specifications?.dimensions?.height != null
              ? String(p.specifications.dimensions.height)
              : "",
          length:
            p.specifications?.dimensions?.length != null
              ? String(p.specifications.dimensions.length)
              : "",
          ageRange: p.specifications?.ageRange || "",
          color: p.specifications?.color || "",
          isFeatured: p.isFeatured || false,
          isPublished: p.isPublished || false,
          images: [],
          category: p.category?.id || "",
        });
        initializedRef.current = true;
      });
    }
  }, [productData, isNew]);

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  }

  function onLangChange(
    field: "title" | "description",
    lang: "hy" | "en" | "ru",
    value: string,
  ) {
    setForm((f) => ({
      ...f,
      [field]: {
        ...f[field],
        [lang]: value,
      },
    }));
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setForm((f) => ({ ...f, images: files }));
  }

  function onSwitchChange(name: string, checked: boolean) {
    setForm((f) => ({ ...f, [name]: checked }));
  }

  function onSelectChange(name: string, value: string) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const input = {
      title: form.title,
      description: form.description,
      slug: slugify(form.title.en || form.title.hy),
      price: parseFloat(form.price) || 0,
      discount: parseFloat(form.discount) || 0,
      currency: form.currency,
      stock: parseInt(form.stock) || 0,
      specifications: {
        material: form.material,
        weight: parseFloat(form.weight) || 0,
        color: form.color,
        dimensions: {
          width: parseFloat(form.width) || 0,
          height: parseFloat(form.height) || 0,
          length: parseFloat(form.length) || 0,
        },
        ageRange: form.ageRange,
      },

      isFeatured: form.isFeatured,
      isPublished: form.isPublished,
      images: [],
      uploadedImages: form.images,
      categoryId: form.category,
    };

    try {
      if (isNew) {
        await createProduct({ variables: { input } });
        router.push("/products");
      } else {
        await updateProduct({ variables: { id, input } });
        await productRefetch();
        toast.success("Product updated successfully");
      }
    } catch (err) {
      toast.error("Error saving product");
      console.error(err);
    }
  }

  if (!isNew && productLoading) return <p>Loading...</p>;
  if (!isNew && productError) return <p>Error loading product.</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isNew ? "Create Product" : "Edit Product"}</CardTitle>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              value={form.title.hy}
              onChange={(e) => onLangChange("title", "hy", e.target.value)}
              placeholder="Title (HY)"
              required
            />
            <Input
              value={form.title.en}
              onChange={(e) => onLangChange("title", "en", e.target.value)}
              placeholder="Title (EN)"
              required
            />
            <Input
              value={form.title.ru}
              onChange={(e) => onLangChange("title", "ru", e.target.value)}
              placeholder="Title (RU)"
              required
            />
          </div>
          <div className="space-y-2">
            <Textarea
              value={form.description.hy}
              onChange={(e) =>
                onLangChange("description", "hy", e.target.value)
              }
              placeholder="Description (HY)"
              rows={3}
            />
            <Textarea
              value={form.description.en}
              onChange={(e) =>
                onLangChange("description", "en", e.target.value)
              }
              placeholder="Description (EN)"
              rows={3}
            />
            <Textarea
              value={form.description.ru}
              onChange={(e) =>
                onLangChange("description", "ru", e.target.value)
              }
              placeholder="Description (RU)"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={onChange}
              placeholder="Price"
              required
              aria-label="Price"
            />
            <Input
              name="discount"
              type="number"
              step="0.01"
              value={form.discount}
              onChange={onChange}
              placeholder="Discount"
              aria-label="Discount"
            />
            <Select
              value={form.currency}
              onValueChange={(v) => onSelectChange("currency", v)}
              aria-label="Currency">
              <SelectTrigger>
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem
                    key={c}
                    value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            name="stock"
            type="number"
            value={form.stock}
            onChange={onChange}
            placeholder="Stock"
            required
            aria-label="Stock"
          />
          <Input
            name="material"
            value={form.material}
            onChange={onChange}
            placeholder="Material"
            aria-label="Material"
          />
          <div className="grid grid-cols-4 gap-4">
            <Input
              name="weight"
              type="number"
              step="0.01"
              value={form.weight}
              onChange={onChange}
              placeholder="Weight"
              aria-label="Weight"
            />
            <Input
              name="width"
              type="number"
              step="0.01"
              value={form.width}
              onChange={onChange}
              placeholder="Width"
              aria-label="Width"
            />
            <Input
              name="height"
              type="number"
              step="0.01"
              value={form.height}
              onChange={onChange}
              placeholder="Height"
              aria-label="Height"
            />
            <Input
              name="length"
              type="number"
              step="0.01"
              value={form.length}
              onChange={onChange}
              placeholder="Length"
              aria-label="Length"
            />
          </div>
          <Select
            value={form.ageRange}
            onValueChange={(v) => onSelectChange("ageRange", v)}
            aria-label="Age Range">
            <SelectTrigger>
              <SelectValue placeholder="Age Range" />
            </SelectTrigger>
            <SelectContent>
              {ageRanges.map((ar) => (
                <SelectItem
                  key={ar}
                  value={ar}>
                  {ar}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            name="color"
            value={form.color}
            onChange={onChange}
            placeholder="Color"
            aria-label="Color"
          />
          {categoriesLoading || !categoriesData ? (
            <p>Loading categories...</p>
          ) : (
            <Select
              value={form.category}
              onValueChange={(v) => onSelectChange("category", v)}
              aria-label="Category"
              disabled={!isNew && !categoriesData?.categories.length}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categoriesData.categories.map((cat) => (
                  <SelectItem
                    key={cat.id}
                    value={String(cat.id)}>
                    {cat.title.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={onFileChange}
            aria-label="Images"
          />
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={form.isFeatured}
                onCheckedChange={(checked: boolean) =>
                  onSwitchChange("isFeatured", Boolean(checked))
                }
                id="isFeatured"
              />
              <label htmlFor="isFeatured">Featured</label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={form.isPublished}
                onCheckedChange={(checked: boolean) =>
                  onSwitchChange("isPublished", Boolean(checked))
                }
                id="isPublished"
              />
              <label htmlFor="isPublished">Published</label>
            </div>
          </div>
        </CardContent>
        <CardFooter className={"mt-2"}>
          <Button
            type="submit"
            disabled={creating || updating}>
            {isNew
              ? creating
                ? "Creating..."
                : "Create Product"
              : updating
                ? "Updating..."
                : "Update Product"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Product;
