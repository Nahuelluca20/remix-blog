---
title: NextJS 14 + AuthJS V5
tags: ["nextjs", "authjs"]
date: "10/12/23"
---

# Create a comment application with NextJS and auth.js

In this tutorial we will use Nextjs with app router and the new version of authjs v5. We will create a small application where if the user is logged in they can add a comment, but if not they can only see the comments.

## Overview

This project will have 2 public routes and 1 private. we will use the `nextjs middlewares` to see which route is private and redirect to in login. We will also use `authjs` to determine in a public route whether the user is logged in or not.

Other tools we will use in this project:

- `Prima`, an ORM that allows us to connect to the database, perform queries and define schemas.
- As a database we will use `Supabase`, a serverless database that is very intuitive to use.
- For the styles we will use `shadcn/ui` and `tailwindCSS`

## Implementation

The first step is to create our project in Nextjs and install the necessary dependencies

```
npx create-next-app@latest
```

Then go to the project folder and install the following dependencies

```
npm install next-auth@beta
npx shadcn-ui@latest init
npm install prisma --save-dev
```

### Setting up AuthJS

We will create the auth.ts file that will be in the lib folder like `lib/auth.ts`.
Inside the file we will put this configuration:

```javascript
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITGUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITGUB_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    authorized(params) {
      return !!params.auth?.user;
    },
  },
});
```

In this case we will use Github as a provider. For this you have to create an OAuth application in your github account and then put the growths in an `.env` file. You can follow this [guide](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app).

Then we will create the middleware.ts in the root of our project and put this:

```javascript
export { auth as default } from "@/lib/auth";

export const config = { matcher: ["/protected"] };
```

The middleware will be in charge of detecting and redirecting `sign in` if a non-logged user enters the `/protected` route

And finally, within the app directory we will create a route handler. It has to be something like this: `app/api/auth/[...nextauth]/route.ts`

What `[...nextauth]` does is allow all requests that start with `/api/auth/*`. Inside the file it will put this:

```javascript
export { GET, POST } from "@/lib/auth";
```

### Setting up Prisma

Ok, with the Authjs configuration, now we will move on to the prism configuration. In the lib folder we will create the prisma.ts file to create our `PrismaClient`

```javascript
import {PrismaClient} from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

Then we will create a folder called prism and inside we will put our schema.prisma that will define the schema of our database. So in `prisma/schema.prisma`:

```javascript
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model comments {
  timeAgo  DateTime @default(now())
  username String
  comment  String
  id       String   @id(map: "comment_pkey") @default(dbgenerated("gen_random_uuid()")) @db.Uuid
}
```

This schema defines the comments table and the connection with the database that we will see later.

### Setting up Supabase

Setting up supabase is as easy as creating an account and starting a project. Then in the project we will have to go to setting -> database and there we will look for `Connection Pooling Custom Configuration` that will go in our environment variable `DATABASE_URL` and `Connection string URI` that will go in `DIRECT_URL` for more information you can consult [prisma + supabase](https://www.prisma.io/docs/orm/overview/databases/supabase)

> Note: when querying the database it did not work, I solved this error by putting `?pgbouncer=true` at the end of the `DATABASE_URL` and `DIRECT_URL` URLs

After you have correctly set the environment variables, you will execute the `npx prisma generate` and `npx prisma db push` commands so that the types and upload the schema to the database

### Everything ready, let's go with the routes

We will start by creating our public route app/public/page.tsx and we will put the following:

```javascript
import Link from "next/link";

import LayoutContainer from "@/components/layout-container";
import CommentsContainer from "@/components/comments-container";
import SessionButton from "@/components/session-button";

export default async function page() {
  return (
    <LayoutContainer>
      <main>
        <header className="w-full flex justify-between">
          <Link className="text-xl font-bold" href={"/"}>
            Hi! This is an example of NextJS 14 + AuthJS
          </Link>
          <div className="flex gap-2">
            <SessionButton />
          </div>
        </header>
        <div className="my-10 text-xl font-medium max-w-[900px]">
          <p>
            You can access this route since the middleware is responsible for
            checking if the user is logged in to the routes that begin with{" "}
            {"/protected"}
          </p>
          <p>
            If you are not logged in you will be able to see the comments but
            not post one
          </p>
        </div>
        <CommentsContainer />
      </main>
    </LayoutContainer>
  );
}
```

So this route is publicly accessible since it does not start with protected. Now we will see how `<SessionButton />` and `<CommentsContainer />` works

Let's start with the SessionButton, it's simple, the only thing it does is obtain the session from auth and depending on whether it is null or not, it renders a signIn or LogOut button. And using the form actions log in or log out the user.

```javascript
import { auth, signIn, signOut } from "@/lib/auth";

import { Button } from "./ui/button";

export default async function SessionButton() {
  const session = await auth();

  return (
    <>
      {session !== null ? (
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button>Log Out</Button>
        </form>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn();
          }}
        >
          <Button>Sign in</Button>
        </form>
      )}
    </>
  );
}
```

`<CommentsContainer/>` lo que hace es obtener la session y lo comments para mapearlos

```javascript
import { auth } from "@/lib/auth";
import { getComments } from "@/db/queries";

import CardComment from "./card-comment";
import AddCommentForm from "./add-comment-form";

export default async function CommentsContainer() {
  const session = await auth();
  const comments = await getComments();

  return (
    <div>
      <h2 className="font-semibold text-2xl mb-4">Comments</h2>

      <AddCommentForm session={session} />

      <div className="md:w-3/4 mx-auto">
        {comments?.data
          ?.sort((a, b) => b.timeAgo.getTime() - a.timeAgo.getTime())
          .map((comment, index) => (
            <CardComment
              key={`comment-${index}`}
              avatarFallback={`U${index}`}
              comment={comment.comment}
              timeAgo={comment.timeAgo.toDateString()}
              username={comment.username}
            />
          ))}
      </div>
    </div>
  );
}
```

To obtain the comments we create a `db/queries.ts` file and create the getComments function to obtain the data with prisma.

```javascript
"use server";
import { prisma } from "@/lib/prisma";
export async function getComments() {
  try {
    const data = await prisma.comments.findMany();

    if (data) return { data: data, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
}
```

Ahora se preguntara que hace `<AddCommentForm session={session} />`. Se encarga de validar si el usuario esta logueado y postear un commentarios si es que si lo está.

```javascript
"use client";
import type { Session } from "next-auth";

import { useFormState, useFormStatus } from "react-dom";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { addComment } from "@/db/queries";

import { Input } from "./ui/input";
import { Button } from "./ui/button";

const initialState = {
  message: "undefined",
};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      aria-disabled={pending}
      className="text-white bg-vercel-blue hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      disabled={disabled}
      type="submit"
    >
      Post
    </Button>
  );
}

export default function AddCommentForm({
  session,
}: {
  session: Session | null,
}) {
  const [state, formAction] = useFormState(addComment, initialState);

  return (
    <form
      action={formAction}
      className="flex w-full max-w-sm items-center space-x-2 my-4 mx-auto"
    >
      <TooltipProvider>
        <Tooltip>
          <Input
            className="hidden"
            defaultValue={session?.user?.name ?? ""}
            disabled={session === null}
            id="username"
            name="username"
            placeholder="username"
            type="text"
          />
          <TooltipTrigger asChild>
            <Input
              className="flex-grow"
              disabled={session === null}
              id="comment"
              name="comment"
              placeholder="Add a comment..."
              type="text"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {session === null ? "You need to be logged in" : "Post a comment"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Button disabled={session === null} type="submit">
        Post
      </Button>
      <SubmitButton disabled={session === null} />
      <p aria-live="polite" className="sr-only" role="status">
        {state?.message}
      </p>
    </form>
  );
}
```

For this we will have to create a new query in our queries.ts file that will be `addComment` and will be responsible for receiving the information from the inputs and validating it with `zod` then using prisma it will create the new comment and using `revalidatePath` from NextJS it will revalidate the cached data.

```javascript
import { z } from "zod";
import { revalidatePath } from "next/cache";

export async function addComment(prevState: any, formData: FormData) {
  const schema = z.object({
    comment: z.string().min(1),
    username: z.string().min(1),
  });

  const parse = schema.safeParse({
    comment: formData.get("comment"),
    username: formData.get("username"),
  });

  if (!parse.success) {
    return { message: "Failed to create product" };
  }

  const productData = parse.data;

  try {
    await prisma.comments.create({
      data: {
        comment: productData.comment,
        username: productData.username,
        timeAgo: new Date(),
      },
    });
    revalidatePath("/public");

    return { message: `Added todo ${productData.comment}` };
  } catch (e) {
    return { message: "Failed to create todo" };
  }
}
```

### The end

I hope this little example has helped you. You can see the live demo [here](https://nextjs-authjs-example.vercel.app/) and the code [here](https://github.com/Nahuelluca20/nextjs-authjs-example).
