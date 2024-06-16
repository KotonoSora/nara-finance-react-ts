export default {
  extends: ["@commitlint/config-conventional", "@commitlint/cz-commitlint"],
  rules: {
    "subject-case": [
      2,
      "always",
      [
        "sentence-case",
        "start-case",
        "pascal-case",
        "upper-case",
        "kebab-case",
      ],
    ],
  },
  parserPreset: "conventional-changelog-conventionalcommits",
};
