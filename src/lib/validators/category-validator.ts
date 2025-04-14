import { z } from "zod";

export const CATEGORY_NAME_VALIDATOR = z.string().min(1,"Category name is required").regex(/^[A-Za-z0-9-]+$/,"Category name can only contain latters, numbers or dashesh")