"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Star } from 'lucide-react';


export default function ReviewSection({ artisanId }: { artisanId: string }) {
const [rating, setRating] = useState(0);
const [comment, setComment] = useState("");
const [loading, setLoading] = useState(false);


async function submitReview() {
setLoading(true);
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
alert("Vous devez être connecté pour laisser un avis.");
setLoading(false);
return;
}

const { error } = await supabase.from('reviews').insert([
{ artisan_id: artisanId, author_id: user.id, rating, comment }
]);

if (error) alert("Vous avez déjà laissé un avis pour cet artisan.");
else {
alert("Merci pour votre avis !");
setComment("");
setRating(0);
}
setLoading(false);
}

return (
<div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mt-8">
    <h2 className="text-xl font-black mb-6">Laisser un avis</h2>

    {/* Étoiles cliquables */}
    <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} onClick={() => setRating(star)}>
        <Star size={30} fill={star <= rating ? "#f59e0b" : "none"} className={star <= rating ? "text-amber-500" : "text-slate-300"} />
        </button>
        ))}
    </div>

    <textarea
    className="w-full p-4 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all mb-4"
    placeholder="Racontez votre expérience avec cet artisan..."
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    />

    <button
    onClick={submitReview}
    disabled={loading || rating === 0}
    className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50"
    >
        Publier l'avis
    </button>
</div>
);
}