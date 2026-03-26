import React, { useState, useEffect } from 'react';
import { Trash2, MessageSquare } from 'lucide-react';
import { fetchReviews, deleteReview } from '../services/serviceAPI';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/formatters.js';
import StarRating from './StarRating';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const data = await fetchReviews();
      setReviews(data);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this review?')) {
      try {
        await deleteReview(id);
        toast.info('Review deleted');
        loadReviews();
      } catch (error) {
        toast.error('Failed to delete review');
      }
    }
  };

  return (
    <div className="bg-white border border-ink/5 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-ink/5">
        <h2 className="text-xl font-light">Customer Feedback</h2>
      </div>
      <div className="divide-y divide-ink/5">
        {isLoading ? (
          <div className="p-8 text-center text-ink/40 italic">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center text-ink/40 italic">No reviews found.</div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="p-8 hover:bg-ink/[0.01] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-ink/5 rounded-full flex items-center justify-center">
                    <MessageSquare size={18} className="text-ink/20" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{review.userName}</h3>
                    <p className="text-[10px] text-ink/40 uppercase tracking-widest">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <StarRating rating={review.rating} size={12} showNumeric={false} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[10px] uppercase tracking-widest text-ink/40">Product ID: {review.productId}</p>
                <button 
                  onClick={() => handleDelete(review.id)}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={14} />
                  Delete Review
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
