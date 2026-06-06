import { Link } from 'react-router';
import { Heart, Trash2 } from 'lucide-react';

export default function Wishlist() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4">My Wishlist</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Save your favorite designs and come back to them later
          </p>
        </div>

        {/* Empty State */}
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl mb-4">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-8">
            Start adding your favorite invitation designs to your wishlist
          </p>
          <Link
            to="/explore"
            className="px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all inline-flex items-center gap-2"
          >
            Explore Designs
          </Link>
        </div>
      </div>
    </div>
  );
}
