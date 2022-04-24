var fs = require('fs');
var translations_file = fs.readFileSync('./translations.csv');
var words_file = fs.readFileSync('./words.csv');

var translations_lines = translations_file.toString('utf8').split('\n');
var words_lines = words_file.toString('utf8').split('\n');

var en_to_russian = {};

var words = {};
var c = 1;
while (c < words_lines.length) {

	// id      position        bare    accented        derived_from_word_id    rank    disabled        audio   usage_en
	var l = words_lines[c].split('\t');

	words[l[0]] = l[2];

	c++;
}

var c = 1;
while (c < translations_lines.length) {

	// id,lang,word_id,position,tl,example_ru,example_tl,info
	var l = translations_lines[c].split('\t');

	var lang = l[1];
	var en = l[4];
	var ru_id = l[2];

	if (lang != 'en') {
		// skip
		c++;
		continue;
	}

	// remove "" surrounding en
	en = en.replaceAll('"', '');

	// many en words in csv format (spell separated!)
	var ens = en.split(', ');

	// escape '
	ens[0] = ens[0].replaceAll("'", "\\'");
	words[ru_id] = words[ru_id].replaceAll("'", "\\'");

	// created en<>russian translation json
	en_to_russian[ens[0]] = words[ru_id];

	c++;
}

fs.writeFileSync('en_to_russian.json', JSON.stringify(en_to_russian));
