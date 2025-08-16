// types/video.ts
export type Video = {
  video_id: string;
  user_id: string;
  video_url: string;
  thumbnail_url?: string;
  upload_date: string;
  club_type?: string;
  swing_form?: string;
  swing_note?: string;
};

export type VideoWithSections = Video & {
  sections?: Array<{
    section_group_id: string;
    start_time?: number;
    end_time?: number;
    label?: string;
  }>;
};
