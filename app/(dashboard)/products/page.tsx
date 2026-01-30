"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PRODUCTS } from "@/app/api/query";
import { REMOVE_PRODUCT } from "@/app/api/mutations";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const Products = () => {
  const { data, loading, error, refetch } = useQuery<{
    products: Product[];
    categories: Category[];
  }>(PRODUCTS);

  const [removeProduct] = useMutation(REMOVE_PRODUCT);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products: {error.message}</p>;

  return (
    <div className="space-y-6 p-4 max-w-full">
      <Link
        href="/products/new"
        passHref>
        <Button
          variant="default"
          className="mb-4">
          New Product
        </Button>
      </Link>
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Specifications</TableHead>
              <TableHead>Images Count</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.title?.en ?? "-"}</TableCell>
                <TableCell>{product.slug ?? "-"}</TableCell>
                <TableCell>{product.category?.title?.en ?? "-"}</TableCell>
                <TableCell>
                  <Badge variant="default">
                    {product.price != null ? product.price : "-"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {product.discount != null ? product.discount : "-"}
                </TableCell>
                <TableCell>
                  {product.currency ? (
                    <Badge variant="secondary">{product.currency}</Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {product.stock != null ? product.stock : "-"}
                </TableCell>
                <TableCell>
                  {product.specifications ? (
                    <div className="text-xs space-y-1">
                      {product.specifications.material && (
                        <div>Material: {product.specifications.material}</div>
                      )}
                      {product.specifications.weight != null && (
                        <div>Weight: {product.specifications.weight}</div>
                      )}
                      {product.specifications.dimensions && (
                        <div>
                          Size: {product.specifications.dimensions.width ?? "-"}{" "}
                          × {product.specifications.dimensions.height ?? "-"} ×{" "}
                          {product.specifications.dimensions.length ?? "-"}
                        </div>
                      )}
                      {product.specifications.ageRange && (
                        <div>Age: {product.specifications.ageRange}</div>
                      )}
                      {product.specifications.color && (
                        <div>Color: {product.specifications.color}</div>
                      )}
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{product.images?.length ?? 0}</TableCell>
                <TableCell>
                  {product.isFeatured ? (
                    <Badge variant="default">Yes</Badge>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {product.isPublished ? (
                    <Badge variant="default">Yes</Badge>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {product.createdAt
                    ? new Date(product.createdAt).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href={`/products/${product.id}`}>
                      <Button
                        variant="outline"
                        size="sm">
                        Edit
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete product</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the product &quot;
                            {product.title.en}&quot;?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              try {
                                await removeProduct({
                                  variables: { id: product.id },
                                });
                                await refetch();
                              } catch (err) {
                                console.error("Failed to delete product:", err);
                              }
                            }}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Products;
