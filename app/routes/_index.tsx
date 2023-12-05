import Header from "~/components/header";

export function headers({
  loaderHeaders,
  parentHeaders,
}: {
  loaderHeaders: Headers;
  parentHeaders: Headers;
}) {
  console.log(
    "This is an example of how to set caching headers for a route, feel free to change the value of 60 seconds or remove the header"
  );
  return {
    "Cache-Control": "public, max-age=60, s-maxage=60",
  };
}

export default function Index() {
  return (
    <main>
      <Header />
    </main>
  );
}
