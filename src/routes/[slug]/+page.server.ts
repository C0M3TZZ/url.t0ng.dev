import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    const { slug } = params;
    const url = await prisma.url.findUnique({
        where: {
            slug: slug as string
        }
    });
    if (url) {
        throw redirect(302 ,url.url);
    } else {
        throw redirect(302, '/');
    }
};
