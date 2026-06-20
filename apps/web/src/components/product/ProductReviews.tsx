"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "@/lib/api/client";
import { useAuth } from "@/lib/api/hooks/use-auth";
import Button from "@/components/button";

export default function ProductReviews({ productId }: { productId: string }) {
  const { data: user } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const res = await reviewApi.getByProduct(productId);
      return res.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: () => reviewApi.create({ product: productId, rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      setComment("");
    },
  });

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-4">Reviews</h2>
      {isLoading && <p>Loading reviews...</p>}
      <ul className="space-y-3 mb-6">
        {reviews.map((r) => (
          <li key={r._id} className="bg-gray-50 p-3 rounded">
            <p className="font-semibold">{r.user?.name || 'Customer'} — {r.rating}/5</p>
            <p className="text-gray-600">{r.comment}</p>
          </li>
        ))}
        {!isLoading && reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
      </ul>
      {user && (
        <form
          onSubmit={(e) => { e.preventDefault(); createMutation.mutate(); }}
          className="space-y-2 max-w-md"
        >
          <select
            className="w-full border p-2 rounded"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} stars</option>
            ))}
          </select>
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Write a review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <Button type="submit" disabled={createMutation.isPending}>Submit Review</Button>
        </form>
      )}
    </div>
  );
}
