"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  X,
  Star,
  GripVertical,
  ImageIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { productsService } from "@/services/products.service"

interface ImageUploadManagerProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  label?: string
  productId?: string
}

export function ImageUploadManager({
  images,
  onChange,
  maxImages = 6,
  label = "Imagens do Produto",
  productId,
}: ImageUploadManagerProps) {
  const [dragOver, setDragOver] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const canAddMore = images.length < maxImages
  const mainImage = images[0] || null
  const additionalImages = images.slice(1)

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files) return

      const newImages: string[] = []
      const remainingSlots = maxImages - images.length
      const filesToProcess = Math.min(files.length, remainingSlots)

      setUploading(true)
      
      for (let i = 0; i < filesToProcess; i++) {
        const file = files[i]
        if (file.type.startsWith("image/")) {
          try {
            // Upload para S3
            const result = await productsService.uploadImage(file, productId)
            newImages.push(result.url)
          } catch (error) {
            console.error("Erro ao fazer upload da imagem:", error)
            // Fallback para URL local se o upload falhar
            const url = URL.createObjectURL(file)
            newImages.push(url)
          }
        }
      }
      
      setUploading(false)

      if (newImages.length > 0) {
        onChange([...images, ...newImages])
      }
    },
    [images, maxImages, onChange, productId]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const setAsMain = (index: number) => {
    if (index === 0) return
    const newImages = [...images]
    const [movedImage] = newImages.splice(index, 1)
    newImages.unshift(movedImage)
    onChange(newImages)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onChange(newImages)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleImageDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      moveImage(draggedIndex, targetIndex)
      setDraggedIndex(targetIndex)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">{label}</Label>
        <Badge variant="outline" className="text-xs">
          {images.length}/{maxImages} imagens
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        A primeira imagem será a imagem principal do produto. Arraste para reordenar.
        <span className="block mt-1 text-amber-600">
          {maxImages === 6
            ? "1 imagem principal + até 5 imagens adicionais"
            : `Máximo de ${maxImages} imagens`}
        </span>
      </p>

      {/* Main Image Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          <span className="text-sm font-medium">Imagem Principal</span>
        </div>

        {mainImage ? (
          <div
            className="relative group aspect-square w-full max-w-[280px] overflow-hidden rounded-lg border-2 border-amber-200 bg-zinc-100"
            draggable
            onDragStart={() => handleDragStart(0)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleImageDragOver(e, 0)}
          >
            <Image
              src={mainImage}
              alt="Imagem principal"
              fill
              className="object-cover"
              sizes="280px"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

            {/* Actions overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                className="h-8"
                onClick={() => setPreviewImage(mainImage)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Visualizar
              </Button>
            </div>

            {/* Badge */}
            <Badge className="absolute top-2 left-2 bg-amber-500">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Principal
            </Badge>

            {/* Remove button */}
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(0)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Drag handle indicator */}
            <div className="absolute bottom-2 left-2 bg-black/60 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="h-4 w-4 text-white" />
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "flex aspect-square w-full max-w-[280px] flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
              dragOver
                ? "border-amber-500 bg-amber-50"
                : "border-muted-foreground/25 bg-muted hover:bg-muted/80 cursor-pointer"
            )}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
            <span className="text-sm font-medium">Adicionar imagem principal</span>
            <span className="text-xs text-muted-foreground mt-1">
              Clique ou arraste uma imagem
            </span>
          </div>
        )}
      </div>

      {/* Additional Images Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              Imagens Adicionais ({additionalImages.length}/{maxImages - 1})
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Additional image thumbnails */}
          {additionalImages.map((image, idx) => {
            const originalIndex = idx + 1
            return (
              <div
                key={originalIndex}
                className={cn(
                  "relative group aspect-square w-24 h-24 overflow-hidden rounded-lg border-2 bg-zinc-100 transition-all",
                  draggedIndex === originalIndex
                    ? "border-primary opacity-50"
                    : "border-transparent hover:border-zinc-300"
                )}
                draggable
                onDragStart={() => handleDragStart(originalIndex)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleImageDragOver(e, originalIndex)}
              >
                <Image
                  src={image}
                  alt={`Imagem ${originalIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />

                {/* Number badge */}
                <Badge
                  variant="secondary"
                  className="absolute top-1 left-1 h-5 min-w-5 text-xs px-1"
                >
                  {originalIndex + 1}
                </Badge>

                {/* Actions overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setPreviewImage(image)}
                      title="Visualizar"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setAsMain(originalIndex)}
                      title="Definir como principal"
                    >
                      <Star className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => removeImage(originalIndex)}
                    title="Remover"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                {/* Drag handle */}
                <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="h-3 w-3 text-white drop-shadow" />
                </div>
              </div>
            )
          })}

          {/* Add more button */}
          {canAddMore && (
            <button
              type="button"
              className={cn(
                "flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 bg-muted hover:bg-muted/80"
              )}
              onClick={() => !uploading && fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
              ) : (
                <>
                  <Plus className="h-6 w-6 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">Adicionar</span>
                  <span className="text-xs text-muted-foreground">
                    {maxImages - images.length} restantes
                  </span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Empty state for additional images */}
        {additionalImages.length === 0 && !mainImage && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            Nenhuma imagem adicionada. Adicione uma imagem principal primeiro.
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
        <p className="text-sm text-blue-800">
          <strong>Dicas para melhores resultados:</strong>
        </p>
        <ul className="text-sm text-blue-700 mt-1 space-y-1 list-disc list-inside">
          <li>Use imagens com pelo menos 800x800 pixels</li>
          <li>Mostre o produto de diferentes ângulos (frente, lado, detalhes)</li>
          <li>Use fundo branco ou neutro para a imagem principal</li>
          <li>Inclua fotos do produto em uso quando aplicável</li>
        </ul>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-3xl p-2">
          <DialogHeader className="sr-only">
            <DialogTitle>Preview da imagem</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="relative aspect-square w-full">
              <Image
                src={previewImage}
                alt="Preview"
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
