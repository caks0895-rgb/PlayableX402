import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/skill")({
  beforeLoad: () => {
    throw redirect({ to: "/docs" });
  },
  component: () => null,
});
