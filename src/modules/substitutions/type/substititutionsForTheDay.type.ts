import { ClassChange } from './classChange.type';
import { Substitution } from './substitution.type';

export type SubstitutionsForTheDay = {
  date?: string;
  substitutions?: Substitution[];
  classChanges?: ClassChange[];
};
