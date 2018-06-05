const HORIZONTAL_ELLIPSIS = '\u2026';


const truncByCharacter = (str, character, restMarker = HORIZONTAL_ELLIPSIS) => {
  const truncated = `${str.substr(0, str.lastIndexOf(character))}`;
  return truncated ? `${truncated}${restMarker}` : '';
};

export const trunc = (str, limit, noSentenceBreak) => {
  if (!str) {
    return '';
  }
  if (str.length <= limit) {
    return str;
  }
  const truncated = str.substr(0, limit);
  const finaltrunc = truncByCharacter(truncated, noSentenceBreak ? '.' : ' ');
  if (noSentenceBreak && !finaltrunc) {
    return truncByCharacter(truncated, ' ');
  }
  return finaltrunc;
};
