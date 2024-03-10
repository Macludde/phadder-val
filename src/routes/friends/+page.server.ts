import { prismaClient } from "$lib";
import { Underline } from "lucide-svelte";
import type { Actions } from "./$types";

export const load = async () => {
  const applicants = await prismaClient.applicant.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return {
    applicants,
  };
};

export const actions: Actions = {
  addFriends: async ({ request }) => {
    const data = await request.formData();
    const id = Number.parseInt(data.get("id") as string);
    const friend1 = Number.parseInt(data.get("friend1") as string);
    let friend2 = null;
    if (data.has("friend2")) {
      friend2 = Number.parseInt(data.get("friend2") as string);
    }
    await prismaClient.applicant.update({
      where: {
        id,
      },
      data: {
        friend1: {
          connect: {
            id: friend1,
          },
        },
        friend2: friend2
          ? {
              connect: {
                id: friend2,
              },
            }
          : undefined,
      },
    });
  },
};
