import { prismaClient } from "$lib";
import type { Load } from "@sveltejs/kit";
import type { Actions } from "./$types";
import type { Prisma, Position} from "@prisma/client";

export const load = async () => {
    const applicantsWithoutOrder = await prismaClient.applicant.findMany({
        where: {
            ApplicantPosition: {
                some: {
                    order: null,
                }
            }
        },
        include: {
            ApplicantPosition: true,
        }
    });

    return {
        applicants: applicantsWithoutOrder
    }
};

export const actions: Actions = {
    setOrder: async ({ request }) => {
        const data = await request.formData();
        await prismaClient.applicantPosition.update({
            where: {
                position_applicantId: {
                    applicantId: Number.parseInt(data.get("applicantId") as string),
                    position: data.get("position") as Position
                }
            },
            data: {
                order: parseInt(data.get("order") as string)
            }
        });
    },
    setSingles: async () => {
        const applicantsWithOnlyOnePosition = await prismaClient.applicantPosition.groupBy({
            by: ["applicantId"],
            having: {
                position: {
                    _count: {
                        equals: 1
                    }
                }
            },
            where: {
                order: null
            }
        });
        await prismaClient.applicantPosition.updateMany({
            where: {
                applicantId: {
                    in: applicantsWithOnlyOnePosition.map(applicant => applicant.applicantId)
                },
            },
            data: {
                order: 1
            }
        });
    }
}