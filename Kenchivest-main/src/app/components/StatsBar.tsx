import { Heart, Users, MessageCircle } from 'lucide-react';

interface StatsBarProps {
  followers: number;
  totalLikes: number;
  totalComments: number;
}

export function StatsBar({ followers, totalLikes, totalComments }: StatsBarProps) {
  return (
    <div className="bg-secondary/40 border-y border-border">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white border border-border flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl text-foreground">{followers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white border border-border flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl text-foreground">{totalLikes.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white border border-border flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl text-foreground">{totalComments.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Comments</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
