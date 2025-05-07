import * as z from "zod";

export const ProductImageSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "La imagen no debe superar 5MB",
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
          file.type
        ),
      { message: "Solo se permiten imágenes JPG, JPEG o PNG" }
    ),
});

export const BenefitSchema = z.object({
  benefit: z.string().min(1, "El beneficio es requerido"),
});

export const ProductFormSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre del producto es requerido")
    .max(200, "El nombre no puede tener más de 200 caracteres")
    .transform((val) => val.trim()),

  description: z
    .string()
    .min(1, "La descripción del producto es requerida")
    .transform((val) => val.trim()),

  memberPrice: z
    .number()
    .min(0, "El precio de socio no puede ser negativo")
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: "El precio debe tener máximo 2 decimales",
    }),

  publicPrice: z
    .number()
    .min(0, "El precio público no puede ser negativo")
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: "El precio debe tener máximo 2 decimales",
    }),

  stock: z.number().min(0, "El stock no puede ser negativo").optional(),

  benefits: z.array(BenefitSchema).optional(),

  categoryId: z.number().min(1, "Debe seleccionar una categoría"),

  isActive: z.boolean().default(true),

  images: z
    .array(ProductImageSchema)
    .min(1, "Debe agregar al menos una imagen")
    .max(5, "Máximo 5 imágenes permitidas"),
});

export type ProductFormType = z.infer<typeof ProductFormSchema>;
export type ProductImageType = z.infer<typeof ProductImageSchema>;
export type BenefitType = z.infer<typeof BenefitSchema>;
