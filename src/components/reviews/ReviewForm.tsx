"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/reviews/StarRating";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  title: z.string().max(100).optional(),
  content: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(2000, "Review must be under 2000 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  providerId: string;
  providerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ReviewForm({
  providerId,
  providerName,
  open,
  onOpenChange,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, title: "", content: "" },
  });

  const contentValue = watch("content") || "";

  async function onSubmit(data: ReviewFormData) {
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId,
          rating,
          title: data.title || undefined,
          content: data.content,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error || "Something went wrong");
        return;
      }

      toast.success("Your review has been submitted!");
      reset();
      setRating(0);
      onOpenChange(false);
      onSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>for {providerName}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <Label>Your Rating *</Label>
            <div className="mt-1">
              <StarRating
                rating={rating}
                size="lg"
                interactive
                onRatingChange={(r) => {
                  setRating(r);
                }}
              />
              <input type="hidden" {...register("rating", { valueAsNumber: true })} value={rating} />
            </div>
            {rating === 0 && errors.rating && (
              <p className="mt-1 text-sm text-red-600">
                {errors.rating.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              placeholder="Summarise your experience"
              maxLength={100}
              {...register("title")}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="content">Your Review *</Label>
            <Textarea
              id="content"
              placeholder="Share your experience with this provider. What did you like? What could be improved?"
              maxLength={2000}
              rows={5}
              {...register("content")}
              className="mt-1"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-400">
              <span>Min. 10 characters</span>
              <span>{contentValue.length} / 2000</span>
            </div>
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">
                {errors.content.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
