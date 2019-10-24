'use babel';

const Ghci = require('./ghci');

export default class AutocompleteProvider {

  constructor() {
    this.selector = '.source.tidalcycles';
    if (atom.config.get('tidalcycles.autocomplete')) {
      Ghci.exec(`:browse Sound.Tidal.Context`, (output) => {
        this.suggestions = this.parse(output)
      })
    } else {
      this.suggestions = []
    }

  }

  getSuggestions(options) {
    const { prefix } = options;
    return this.suggestions
      .filter(suggestion => {
        let textLower = suggestion.text.toLowerCase();
        return textLower.startsWith(prefix.toLowerCase());
      });
  }

  parse(exportedIdentifiers) {
    let functions = exportedIdentifiers
      .split("\n")
      .reduce((acc, cur) =>
        cur.startsWith(" ")
          ? acc + ' ' + cur.trim()
          : acc + '\n' + cur
      )

    return functions
      .split("\n")
      .filter(row => row.indexOf('::') > -1)
      .map(row => {
        let fields = row.split('::')
        let functionPath = fields[0].trim().replace("(", "").replace(")", "")
        return {
          text: functionPath.substring(functionPath.lastIndexOf('.') + 1),
          description: fields[1].trim(),
          type: 'function',
          rightLabel: functionPath.substring(0, functionPath.lastIndexOf('.')),
        }
      })
  }
}