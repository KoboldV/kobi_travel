export default function flagEmojiToCountryCode(flag: string) {
  return Array.from(flag)
    .map((char) => String.fromCharCode(char.codePointAt(0)! - 127397))
    .join("")
    .toLowerCase();
}
