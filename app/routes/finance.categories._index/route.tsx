import { like } from "drizzle-orm";
import { AlertCircleIcon, CheckCircle2Icon, TrashIcon } from "lucide-react";
import { Suspense } from "react";
import {
  Await,
  Form,
  useFetcher,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "react-router";

import type { Route } from "./+types/route";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import * as schema from "~/database/schema";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Finance Categories" },
    { name: "description", content: "Explore various finance categories" },
  ];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const categories = await context.db.query.categories.findMany({
    columns: {
      id: true,
      name: true,
    },
    where: q ? like(schema.categories.name, `%${q}%`) : undefined,
  });

  return {
    categories,
    q,
  };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { categories, q } = loaderData;

  const [tabValue, setTabValue] = useSearchParams();

  const handleChangeTab = (value: string) => {
    setTabValue({
      tab: value,
      q: q || "",
    });
  };

  return (
    <div className="container mx-auto min-h-svh p-4">
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Finance Categories
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Welcome to the finance categories page. Here you can explore various
        categories related to finance.
      </p>

      <Tabs
        defaultValue={tabValue.get("tab") || "existing-categories"}
        onValueChange={handleChangeTab}
      >
        <TabsList>
          <TabsTrigger value="add-new-category">Add New Category</TabsTrigger>
          <TabsTrigger value="existing-categories">
            Existing Categories
          </TabsTrigger>
        </TabsList>
        <TabsContent value="add-new-category">
          <Card>
            <CardHeader>
              <CardTitle>Add New Category</CardTitle>
              <CardDescription>
                Use the form below to add a new finance category.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateCategoryForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="existing-categories">
          <Suspense>
            <Await resolve={categories}>
              {(resolvedCategories) => (
                <Card>
                  <CardHeader>
                    <CardTitle>Existing Categories</CardTitle>
                    <CardDescription>
                      Below is a list of existing finance categories. You can
                      use these to categorize your financial transactions.
                    </CardDescription>
                    <SearchCategoryForm />
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Name</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <ListCategories categories={resolvedCategories} />
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </Await>
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const CreateCategoryForm = () => {
  const fetcher = useFetcher();

  return (
    <fetcher.Form
      method="post"
      action="/finance/categories/create"
      className="space-y-4"
      autoComplete="off"
      noValidate
      onSubmit={(event) => {
        if (fetcher.state !== "idle") {
          event.preventDefault();
        }
        const form = event.currentTarget;
        requestAnimationFrame(() => {
          form.reset();
        });
      }}
    >
      <Label htmlFor="categoryName">Category Name</Label>
      <Input id="categoryName" name="categoryName" />

      {fetcher.data?.error && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{fetcher.data.error}</AlertDescription>
        </Alert>
      )}

      {fetcher.data?.success && (
        <Alert variant="default">
          <CheckCircle2Icon />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{fetcher.data.success}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="cursor-pointer"
        disabled={fetcher.state !== "idle"}
      >
        Add Category
      </Button>
    </fetcher.Form>
  );
};

const SearchCategoryForm = () => {
  const fetcher = useFetcher();
  const submit = useSubmit();
  const { q } = useLoaderData();
  const [searchParams] = useSearchParams();

  return (
    <fetcher.Form
      method="get"
      id="search-form"
      action="/finance/categories"
      onChange={(event) => {
        const isFirstSearch = q === null;
        submit(event.currentTarget, {
          replace: !isFirstSearch,
        });
      }}
      onSubmit={(event) => {
        const isFirstSearch = q === null;
        submit(event.currentTarget, {
          replace: !isFirstSearch,
        });
        event.preventDefault();
      }}
      role="search"
      className="mb-4 flex items-center space-x-2"
      autoComplete="off"
      noValidate
    >
      <input
        type="hidden"
        name="tab"
        value={searchParams.get("tab") || "existing-categories"}
      />

      <Input id="q" name="q" className="flex-1" defaultValue={q || ""} />

      <Button
        type="submit"
        className="cursor-pointer"
        disabled={fetcher.state !== "idle"}
      >
        Search
      </Button>
    </fetcher.Form>
  );
};

const ListCategories = ({
  categories,
}: {
  categories: {
    id: number;
    name: string;
  }[];
}) => {
  return categories.map((category) => (
    <CategoryRowItem key={category.id} category={category} />
  ));
};

const CategoryRowItem = ({
  category,
}: {
  category: {
    id: number;
    name: string;
  };
}) => {
  const fetcher = useFetcher();

  return (
    <TableRow>
      <TableCell className="font-medium">{category.name}</TableCell>
      <TableCell className="text-right">
        <Form
          method="delete"
          action={`/finance/categories/${category.id}/destroy`}
          className="inline"
          onSubmit={(event) => {
            if (fetcher.state !== "idle") {
              event.preventDefault();
            }
            const form = event.currentTarget;
            requestAnimationFrame(() => {
              form.reset();
            });
          }}
        >
          <Button
            type="submit"
            variant="destructive"
            size="sm"
            className="cursor-pointer"
            disabled={fetcher.state !== "idle"}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </Form>
      </TableCell>
    </TableRow>
  );
};
