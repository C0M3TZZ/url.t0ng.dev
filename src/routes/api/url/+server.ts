import type { RequestHandler } from '../$types';
import { HttpError, error, json } from '@sveltejs/kit';
import { validator } from '$lib/validator';
import prisma from '$lib/prisma';
import { init } from '@paralleldrive/cuid2';

export const POST: RequestHandler = async ({ request }) => {
	const cuid = init({ length: 7 });
	try {
		const body = await request.json();
		const data = validator.parse(body);
		if (data.custom) {
			const exists = await prisma.url.findUnique({
				where: {
					slug: data.slug
				}
			});
			if (exists) {
				throw error(400, 'url already exists');
			}
		} else {
			data.slug = cuid();
		}

		const result = await prisma.url.create({
			data: { url: data.url, slug: data.slug as string },
			select: {
				slug: true,
                url: true
			}
		});

		return json({
            ...result,
            message: 'url created'
        });
	} catch (e: any) {
		const result = e as Error;
		if (result.name === 'ZodError') {
			throw error(400, result.message);
		}
        if (e.status) {
            const err = e as HttpError;
            throw error(err.status, err.body.message);
        }
		throw error(500, e.message);
	}
};
