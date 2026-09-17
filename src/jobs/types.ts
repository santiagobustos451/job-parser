export type Job = {
  source: string;
  sourceId: string | null;

  title: string;
  company: string | null;
  location: string | null;

  url: string;
  directUrl: string | null;

  datePosted: string | null;

  description: string;

  isRemote: boolean | null;

  salary: {
    min: number | null;
    max: number | null;
    currency: string | null;
    interval: string | null;
  };
};
