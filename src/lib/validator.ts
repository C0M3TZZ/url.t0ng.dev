import zod from 'zod';

export const validator = zod.object({
    url: zod.string().url(),
    custom: zod.boolean(),
    slug: zod.string().optional()
});
