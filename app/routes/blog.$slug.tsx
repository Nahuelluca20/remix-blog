import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  return params.slug;
}

export default function BlogByslug() {
  const param = useLoaderData<typeof loader>();

  return <div>{param}</div>;
}
