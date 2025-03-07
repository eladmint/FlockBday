export interface Campaign {
  id: string;
  title: string;
  description: string;
  visibility: "public" | "private";
  postsCount: number;
  collaboratorsCount: number;
  createdBy: string;
  createdByName?: string;
  createdByAvatar?: string;
  createdAt: number;
  isOwner?: boolean;
  isMember?: boolean;
  twitterEnabled?: boolean;
}
