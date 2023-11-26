import { Substitution } from './substitution.type';

export type PreparedSubstitions = {
  date: string;
  email: string;
  unsubscribeLink: string;
  substitutions: Substitution[];
};
