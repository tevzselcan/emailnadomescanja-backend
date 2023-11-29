import axios from 'axios';
import * as cheerio from 'cheerio';
import { ClassChange } from 'modules/substitutions/type/classChange.type';
import { SubstitutionsForTheDay } from 'modules/substitutions/type/substititutionsForTheDay.type';
import { Substitution } from 'modules/substitutions/type/substitution.type';
import Logging from './Logging';
require('dotenv').config();

async function fetchHTML(url: string): Promise<string> {
  try {
    const axiosResponse = await axios.get(url);
    return axiosResponse.data;
  } catch (error) {
    Logging.error(error);
  }
}

function extractDate(text: string): string | undefined {
  const regex = /(\d{1,2}\.\s\d{1,2}\.\s\d{4})/g;
  const match = regex.exec(text);
  return match ? match[1] : undefined;
}

function extractSubstitutions(
  $: cheerio.Root,
  table: cheerio.Cheerio,
): Substitution[] {
  const substitutions: Substitution[] = [];
  const rows = table.find('tbody tr');

  rows.slice(1).each((_index, row) => {
    const tds = $(row).find('td');

    if (tds.length === 7) {
      const substitution: Substitution = {
        teacher: $(tds[0]).text().trim(),
        absentTeacher: $(tds[1]).text().trim(),
        hour: $(tds[2]).text().trim(),
        class: $(tds[3]).text().trim(),
        classroom: $(tds[4]).text().trim(),
        subject: $(tds[5]).text().trim(),
        type: $(tds[6]).text().trim(),
      };

      substitutions.push(substitution);
    }
  });

  return substitutions;
}

function extractClassChanges(
  $: cheerio.Root,
  table: cheerio.Cheerio,
): ClassChange[] {
  const classChanges: ClassChange[] = [];
  const rows = table.find('tbody tr');

  rows.slice(1).each((_index, row) => {
    const tds = $(row).find('td');

    if (tds.length === 5) {
      const classChange: ClassChange = {
        teacher: $(tds[0]).text().trim(),
        hour: $(tds[1]).text().trim(),
        class: $(tds[2]).text().trim(),
        classroom: $(tds[3]).text().trim(),
        subject: $(tds[4]).text().trim(),
      };

      classChanges.push(classChange);
    }
  });

  classChanges.shift();

  return classChanges;
}

export async function getAllSubstitutions(): Promise<SubstitutionsForTheDay[]> {
  const url = 'https://ker.sc-celje.si/nadomescanje/';
  const className = 'wp-show-posts-entry-content';

  try {
    const htmlCode = await fetchHTML(url);
    const $ = cheerio.load(htmlCode);

    const subtititionsTables = $(`.${className}`);
    const substitutionsForTheDay: SubstitutionsForTheDay[] = [];

    subtititionsTables.each((_index, table) => {
      const dateElement = $(table).find('p');
      const date = extractDate(dateElement.toString());

      const substitutionsAndClassChanges: SubstitutionsForTheDay = {
        date: date || '',
        substitutions: extractSubstitutions($, $(table)),
        classChanges: extractClassChanges($, $(table)),
      };

      substitutionsForTheDay.push(substitutionsAndClassChanges);
    });

    return substitutionsForTheDay;
  } catch (error) {
    Logging.error(error);
  }
}
