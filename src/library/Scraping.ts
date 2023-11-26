import axios from 'axios';
import * as cheerio from 'cheerio';
import { ClassChange } from 'modules/substitutions/type/classChange.type';
import { SubstitutionsForTheDay } from 'modules/substitutions/type/substititutionsForTheDay.type';
import { Substitution } from 'modules/substitutions/type/substitution.type';
require('dotenv').config();

export async function getAllSubstitutions(): Promise<SubstitutionsForTheDay[]> {
  //const url = 'https://ker.sc-celje.si/nadomescanja-za-sredo-18-10-2023/';
  const url = 'https://ker.sc-celje.si/nadomescanje/';
  //const className = 'ed-content-wrap';
  const className = 'wp-show-posts-entry-content';

  const axiosResponse = await axios.get(url);
  const htmlCode = axiosResponse.data;
  const $ = await cheerio.load(htmlCode);

  let substitutionsForTheDay: SubstitutionsForTheDay[] = [];

  const subtititionsTable = $(`.${className}`);
  for (let i = 0; i < subtititionsTable.length; i++) {
    const dateElement = $(subtititionsTable[i]).find('p');
    const date = extractDate(dateElement.toString());

    const substitutionsAndClassChanges: SubstitutionsForTheDay = {
      date,
      substitutions: [],
      classChanges: [],
    };

    const tables = $(subtititionsTable[i]).find('table');
    for (let j = 0; j < tables.length; j++) {
      const rows = $(tables[j]).find('tr');
      const columnCount = $(rows[0]).find('td').length;

      if (columnCount === 7) {
        const extractedSubstitutions = await extractSubstitutions(
          $(subtititionsTable[i]).html()?.toString()!,
        );
        substitutionsAndClassChanges.substitutions.push(
          ...extractedSubstitutions,
        );
      } else if (columnCount === 5) {
        const extractedClassChanges = await extractClassChanges(
          $(subtititionsTable[i]).html()?.toString()!,
        );
        substitutionsAndClassChanges.classChanges.push(
          ...extractedClassChanges,
        );
      }
    }
    substitutionsForTheDay.push(substitutionsAndClassChanges);
  }

  return substitutionsForTheDay;
}

function extractDate(text: string) {
  const regex = /(\d{1,2}\.\s\d{1,2}\.\s\d{4})/g;
  const match = regex.exec(text);
  if (match) {
    const dateString = match[1];
    return dateString;
  }
}

export function extractSubstitutions(html: string): Substitution[] {
  const $ = cheerio.load(html);
  const substitutions: Substitution[] = [];
  const rows = $('table tbody tr');

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

export function extractClassChanges(html: string): ClassChange[] {
  const $ = cheerio.load(html);
  const classChanges: ClassChange[] = [];
  const rows = $('table tbody tr');

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
