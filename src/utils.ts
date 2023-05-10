import { Metadata } from "./sourcify";

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

type Sources = Record<string, { content: string }>;

export function makeStandardJson(metadata: Metadata, sources: Sources) {
  const libraryNames = Object.keys(metadata.settings.libraries);
  console.log(libraryNames);
  return {
    language: metadata.language,
    sources,
    settings: {
      optimizer: metadata.settings.optimizer,
      evmVersion: metadata.settings.evmVersion,
      remappings: metadata.settings.remappings,
      libraries: Object.keys(sources).reduce((libraries, source) => {
        const foundLibraries = libraryNames.filter(
          (libraryName) => sources[source].content.indexOf(libraryName) !== -1
        );

        if (foundLibraries.length > 0) {
          libraries[source] = foundLibraries.reduce((acc, libraryName) => {
            acc[libraryName] = metadata.settings.libraries[libraryName];
            return acc;
          }, {});
        }
        return libraries;
      }, {}),
    },
  };
}
