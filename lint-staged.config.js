module.exports = {
  '**/*.{js,jsx,ts,tsx}': (filenames) => [
    `pnpm eslint --fix ${filenames.map((filename) => `"${filename}"`).join(' ')}`,
  ],
  '**/*.(md|json)': (filenames) =>
    `pnpm prettier --write ${filenames
      .map((filename) => `"${filename}"`)
      .join(' ')}`,
  'src/translations/*.(json)': (filenames) => [
    `pnpm eslint --fix ${filenames
      .map((filename) => `"${filename}"`)
      .join(' ')}`,
  ],
};
