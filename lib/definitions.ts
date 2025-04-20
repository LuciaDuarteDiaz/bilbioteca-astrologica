export type AstroEntry = {
  id?: number;
  title: string;
  description: string;
  planet?: string;
  house?: number;
  sign?: string;
  aspect?: string;
  related_planet?: string;
  tags?: string[];
};
