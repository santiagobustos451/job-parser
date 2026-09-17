export type TargetProfile = {
  name: string;
  id: string;

  searchTerms: string[];
  requiredKeywords?: string[];
  preferredKeywords?: string[];
  excludedKeywords?: string[];

  locations?: string[];
  remoteOnly?: boolean;
};
