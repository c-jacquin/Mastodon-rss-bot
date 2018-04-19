interface TemporaryData {
  articleDate?: string;
  imageUrls?: string[];
}

export interface Toot extends TemporaryData {
  status: string;
  visibility?: string;
  media_ids?: string[];
}
