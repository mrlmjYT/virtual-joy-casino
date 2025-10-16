export interface QuizQuestion {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
  difficulty: number; // 1-10
}

export const quizQuestions: QuizQuestion[] = [
  // Difficulty 1 (Fragen 1-10)
  { id: 1, question: "Wie viele Kontinente gibt es auf der Erde?", answers: ["5", "6", "7", "8"], correctAnswer: 2, difficulty: 1 },
  { id: 2, question: "Welche Farbe hat der Himmel an einem klaren Tag?", answers: ["Rot", "Grün", "Blau", "Gelb"], correctAnswer: 2, difficulty: 1 },
  { id: 3, question: "Wie viele Beine hat eine Spinne?", answers: ["6", "8", "10", "12"], correctAnswer: 1, difficulty: 1 },
  { id: 4, question: "Was ist die Hauptstadt von Österreich?", answers: ["Berlin", "Wien", "Zürich", "München"], correctAnswer: 1, difficulty: 1 },
  { id: 5, question: "Welches Tier gibt Milch?", answers: ["Hund", "Katze", "Kuh", "Pferd"], correctAnswer: 2, difficulty: 1 },
  { id: 6, question: "Wie viele Jahreszeiten gibt es?", answers: ["2", "3", "4", "5"], correctAnswer: 2, difficulty: 1 },
  { id: 7, question: "Welcher Planet ist der Erde am nächsten?", answers: ["Mars", "Venus", "Jupiter", "Saturn"], correctAnswer: 1, difficulty: 1 },
  { id: 8, question: "Wie viele Tage hat eine Woche?", answers: ["5", "6", "7", "8"], correctAnswer: 2, difficulty: 1 },
  { id: 9, question: "Welches Organ pumpt Blut durch den Körper?", answers: ["Gehirn", "Lunge", "Herz", "Magen"], correctAnswer: 2, difficulty: 1 },
  { id: 10, question: "Was ist H2O?", answers: ["Luft", "Wasser", "Feuer", "Erde"], correctAnswer: 1, difficulty: 1 },

  // Difficulty 2 (Fragen 11-20)
  { id: 11, question: "In welchem Jahr fiel die Berliner Mauer?", answers: ["1987", "1989", "1991", "1993"], correctAnswer: 1, difficulty: 2 },
  { id: 12, question: "Welches ist das größte Säugetier der Welt?", answers: ["Elefant", "Giraffe", "Blauwal", "Nashorn"], correctAnswer: 2, difficulty: 2 },
  { id: 13, question: "Wie viele Zähne hat ein erwachsener Mensch normalerweise?", answers: ["28", "30", "32", "34"], correctAnswer: 2, difficulty: 2 },
  { id: 14, question: "Welches Element hat das chemische Symbol 'O'?", answers: ["Osmium", "Sauerstoff", "Gold", "Silber"], correctAnswer: 1, difficulty: 2 },
  { id: 15, question: "Wer malte die Mona Lisa?", answers: ["Picasso", "Van Gogh", "Da Vinci", "Monet"], correctAnswer: 2, difficulty: 2 },
  { id: 16, question: "Wie viele Spieler hat eine Fußballmannschaft auf dem Feld?", answers: ["9", "10", "11", "12"], correctAnswer: 2, difficulty: 2 },
  { id: 17, question: "Welcher ist der längste Fluss der Welt?", answers: ["Nil", "Amazonas", "Donau", "Mississippi"], correctAnswer: 0, difficulty: 2 },
  { id: 18, question: "In welchem Land liegt der Mount Everest?", answers: ["Indien", "China", "Nepal", "Pakistan"], correctAnswer: 2, difficulty: 2 },
  { id: 19, question: "Wie viele Knochen hat ein erwachsener Mensch?", answers: ["186", "206", "226", "246"], correctAnswer: 1, difficulty: 2 },
  { id: 20, question: "Welches ist das kleinste Land der Welt?", answers: ["Monaco", "Vatikanstadt", "San Marino", "Liechtenstein"], correctAnswer: 1, difficulty: 2 },

  // Difficulty 3 (Fragen 21-30)
  { id: 21, question: "Wer schrieb 'Romeo und Julia'?", answers: ["Goethe", "Shakespeare", "Schiller", "Kafka"], correctAnswer: 1, difficulty: 3 },
  { id: 22, question: "Wie viele Saiten hat eine Standard-Gitarre?", answers: ["4", "5", "6", "7"], correctAnswer: 2, difficulty: 3 },
  { id: 23, question: "Welche Programmiersprache wurde von Guido van Rossum erfunden?", answers: ["Java", "Python", "C++", "Ruby"], correctAnswer: 1, difficulty: 3 },
  { id: 24, question: "In welchem Jahr wurde die Titanic versenkt?", answers: ["1910", "1912", "1914", "1916"], correctAnswer: 1, difficulty: 3 },
  { id: 25, question: "Wie heißt die Hauptstadt von Australien?", answers: ["Sydney", "Melbourne", "Canberra", "Brisbane"], correctAnswer: 2, difficulty: 3 },
  { id: 26, question: "Welches ist das härteste natürliche Material?", answers: ["Stahl", "Diamant", "Granit", "Quarz"], correctAnswer: 1, difficulty: 3 },
  { id: 27, question: "Wie viele Bundesländer hat Österreich?", answers: ["7", "8", "9", "10"], correctAnswer: 2, difficulty: 3 },
  { id: 28, question: "Wer entwickelte die Relativitätstheorie?", answers: ["Newton", "Einstein", "Galilei", "Hawking"], correctAnswer: 1, difficulty: 3 },
  { id: 29, question: "Welches Gas atmen Menschen ein?", answers: ["CO2", "O2", "N2", "H2"], correctAnswer: 1, difficulty: 3 },
  { id: 30, question: "In welchem Jahrhundert lebte Mozart?", answers: ["16.", "17.", "18.", "19."], correctAnswer: 2, difficulty: 3 },

  // Difficulty 4 (Fragen 31-40)
  { id: 31, question: "Wie heißt der größte Ozean der Erde?", answers: ["Atlantik", "Indischer Ozean", "Pazifik", "Arktis"], correctAnswer: 2, difficulty: 4 },
  { id: 32, question: "Welches ist das einzige Säugetier, das fliegen kann?", answers: ["Eichhörnchen", "Fledermaus", "Vogel", "Insekt"], correctAnswer: 1, difficulty: 4 },
  { id: 33, question: "Wie viele Herzen hat ein Oktopus?", answers: ["1", "2", "3", "4"], correctAnswer: 2, difficulty: 4 },
  { id: 34, question: "Welcher Planet ist nach dem römischen Kriegsgott benannt?", answers: ["Venus", "Mars", "Jupiter", "Saturn"], correctAnswer: 1, difficulty: 4 },
  { id: 35, question: "In welchem Jahr landeten Menschen zum ersten Mal auf dem Mond?", answers: ["1967", "1969", "1971", "1973"], correctAnswer: 1, difficulty: 4 },
  { id: 36, question: "Wie heißt die Währung in Japan?", answers: ["Yuan", "Won", "Yen", "Ringgit"], correctAnswer: 2, difficulty: 4 },
  { id: 37, question: "Welches ist das giftigste Tier der Welt?", answers: ["Kobra", "Skorpion", "Seewespe", "Schwarze Witwe"], correctAnswer: 2, difficulty: 4 },
  { id: 38, question: "Wie viele Zeitzonen gibt es auf der Erde?", answers: ["12", "18", "24", "36"], correctAnswer: 2, difficulty: 4 },
  { id: 39, question: "Wer erfand das Telefon?", answers: ["Edison", "Bell", "Tesla", "Marconi"], correctAnswer: 1, difficulty: 4 },
  { id: 40, question: "Welches Element hat die Ordnungszahl 79?", answers: ["Silber", "Gold", "Platin", "Kupfer"], correctAnswer: 1, difficulty: 4 },

  // Difficulty 5 (Fragen 41-50)
  { id: 41, question: "Wie heißt die längste Mauer der Welt?", answers: ["Berliner Mauer", "Hadrianswall", "Chinesische Mauer", "Westbank-Mauer"], correctAnswer: 2, difficulty: 5 },
  { id: 42, question: "Welches Vitamin wird durch Sonnenlicht produziert?", answers: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin E"], correctAnswer: 2, difficulty: 5 },
  { id: 43, question: "In welchem Land wurde das Spiel Schach erfunden?", answers: ["China", "Indien", "Persien", "Ägypten"], correctAnswer: 1, difficulty: 5 },
  { id: 44, question: "Wie viele Kammern hat das menschliche Herz?", answers: ["2", "3", "4", "5"], correctAnswer: 2, difficulty: 5 },
  { id: 45, question: "Welcher Künstler schnitt sich ein Ohr ab?", answers: ["Picasso", "Van Gogh", "Dali", "Monet"], correctAnswer: 1, difficulty: 5 },
  { id: 46, question: "Wie heißt der höchste Berg Afrikas?", answers: ["Mount Kenya", "Kilimandscharo", "Mount Meru", "Atlas"], correctAnswer: 1, difficulty: 5 },
  { id: 47, question: "Welches ist das meistgesprochene Sprache der Welt?", answers: ["Englisch", "Spanisch", "Mandarin", "Hindi"], correctAnswer: 2, difficulty: 5 },
  { id: 48, question: "In welchem Jahr begann der Erste Weltkrieg?", answers: ["1912", "1914", "1916", "1918"], correctAnswer: 1, difficulty: 5 },
  { id: 49, question: "Wie viele Monde hat Jupiter?", answers: ["53", "67", "79", "95"], correctAnswer: 3, difficulty: 5 },
  { id: 50, question: "Welches ist das größte Organ des menschlichen Körpers?", answers: ["Leber", "Herz", "Gehirn", "Haut"], correctAnswer: 3, difficulty: 5 },

  // Difficulty 6 (Fragen 51-60)
  { id: 51, question: "Wer war der erste Präsident der USA?", answers: ["Lincoln", "Jefferson", "Washington", "Adams"], correctAnswer: 2, difficulty: 6 },
  { id: 52, question: "Welches chemische Element hat das Symbol 'Fe'?", answers: ["Fluor", "Eisen", "Fermium", "Francium"], correctAnswer: 1, difficulty: 6 },
  { id: 53, question: "In welchem Jahr wurde die Europäische Union gegründet?", answers: ["1991", "1992", "1993", "1994"], correctAnswer: 2, difficulty: 6 },
  { id: 54, question: "Wie heißt die Hauptstadt von Kanada?", answers: ["Toronto", "Montreal", "Vancouver", "Ottawa"], correctAnswer: 3, difficulty: 6 },
  { id: 55, question: "Welcher Planet dreht sich am schnellsten um seine Achse?", answers: ["Erde", "Mars", "Jupiter", "Saturn"], correctAnswer: 2, difficulty: 6 },
  { id: 56, question: "Wie viele Nullen hat eine Million?", answers: ["5", "6", "7", "8"], correctAnswer: 1, difficulty: 6 },
  { id: 57, question: "Wer schrieb 'Die Odyssee'?", answers: ["Homer", "Aristoteles", "Platon", "Sokrates"], correctAnswer: 0, difficulty: 6 },
  { id: 58, question: "Welches ist das am dichtesten besiedelte Land?", answers: ["Indien", "China", "Monaco", "Singapur"], correctAnswer: 2, difficulty: 6 },
  { id: 59, question: "Wie heißt die Angst vor Spinnen?", answers: ["Klaustrophobie", "Arachnophobie", "Agoraphobie", "Akrophobie"], correctAnswer: 1, difficulty: 6 },
  { id: 60, question: "In welchem Jahr endete der Zweite Weltkrieg?", answers: ["1943", "1944", "1945", "1946"], correctAnswer: 2, difficulty: 6 },

  // Difficulty 7 (Fragen 61-70)
  { id: 61, question: "Wie heißt der kleinste Knochen im menschlichen Körper?", answers: ["Steigbügel", "Hammer", "Amboss", "Wadenbein"], correctAnswer: 0, difficulty: 7 },
  { id: 62, question: "Welches ist das einzige Land, das in allen vier Hemisphären liegt?", answers: ["Brasilien", "Kiribati", "Indonesien", "Kenia"], correctAnswer: 1, difficulty: 7 },
  { id: 63, question: "Wer erfand das World Wide Web?", answers: ["Bill Gates", "Steve Jobs", "Tim Berners-Lee", "Mark Zuckerberg"], correctAnswer: 2, difficulty: 7 },
  { id: 64, question: "Wie viele Symphonien komponierte Beethoven?", answers: ["7", "9", "11", "13"], correctAnswer: 1, difficulty: 7 },
  { id: 65, question: "Welches ist das seltenste Blutgruppe?", answers: ["A+", "B-", "AB-", "O-"], correctAnswer: 2, difficulty: 7 },
  { id: 66, question: "In welchem Jahr wurde Google gegründet?", answers: ["1996", "1998", "2000", "2002"], correctAnswer: 1, difficulty: 7 },
  { id: 67, question: "Wie heißt die größte Wüste der Welt?", answers: ["Sahara", "Gobi", "Antarktis", "Arabische Wüste"], correctAnswer: 2, difficulty: 7 },
  { id: 68, question: "Welches Element ist radioaktiv und wird in Kernkraftwerken verwendet?", answers: ["Uran", "Plutonium", "Radium", "Alle"], correctAnswer: 3, difficulty: 7 },
  { id: 69, question: "Wer malte 'Die Sternennacht'?", answers: ["Monet", "Van Gogh", "Picasso", "Rembrandt"], correctAnswer: 1, difficulty: 7 },
  { id: 70, question: "Wie heißt die Hauptstadt von Island?", answers: ["Oslo", "Helsinki", "Reykjavik", "Kopenhagen"], correctAnswer: 2, difficulty: 7 },

  // Difficulty 8 (Fragen 71-80)
  { id: 71, question: "Welches ist das einzige Säugetier, das Eier legt?", answers: ["Ameisenigel", "Schnabeltier", "Beuteltier", "A und B"], correctAnswer: 3, difficulty: 8 },
  { id: 72, question: "In welchem Jahr wurde die Magna Carta unterzeichnet?", answers: ["1215", "1315", "1415", "1515"], correctAnswer: 0, difficulty: 8 },
  { id: 73, question: "Wie viele Rippen hat ein Mensch normalerweise?", answers: ["22", "24", "26", "28"], correctAnswer: 1, difficulty: 8 },
  { id: 74, question: "Welcher Wissenschaftler entdeckte die Radioaktivität?", answers: ["Curie", "Einstein", "Becquerel", "Röntgen"], correctAnswer: 2, difficulty: 8 },
  { id: 75, question: "Wie heißt der tiefste Punkt im Ozean?", answers: ["Marianengraben", "Tongagraben", "Philippinengraben", "Puerto-Rico-Graben"], correctAnswer: 0, difficulty: 8 },
  { id: 76, question: "Welches ist das am längsten regierende Königshaus der Welt?", answers: ["Windsor", "Grimaldi", "Yamato", "Bourbon"], correctAnswer: 2, difficulty: 8 },
  { id: 77, question: "In welchem Jahr wurde die Atombombe erfunden?", answers: ["1939", "1941", "1943", "1945"], correctAnswer: 3, difficulty: 8 },
  { id: 78, question: "Wie viele Sprachen gibt es ungefähr auf der Welt?", answers: ["3000", "5000", "7000", "9000"], correctAnswer: 2, difficulty: 8 },
  { id: 79, question: "Welcher ist der älteste noch aktive Vulkan?", answers: ["Ätna", "Vesuv", "Kilauea", "Krakatau"], correctAnswer: 0, difficulty: 8 },
  { id: 80, question: "Wie heißt der Autor von '1984'?", answers: ["Huxley", "Orwell", "Bradbury", "Kafka"], correctAnswer: 1, difficulty: 8 },

  // Difficulty 9 (Fragen 81-90)
  { id: 81, question: "Welches ist das einzige Land, das keinen rechteckigen Flagge hat?", answers: ["Vatikan", "Nepal", "Schweiz", "Monaco"], correctAnswer: 1, difficulty: 9 },
  { id: 82, question: "Wie viele Aminosäuren gibt es?", answers: ["18", "20", "22", "24"], correctAnswer: 1, difficulty: 9 },
  { id: 83, question: "In welchem Jahr wurde der Euro eingeführt?", answers: ["1997", "1999", "2001", "2002"], correctAnswer: 1, difficulty: 9 },
  { id: 84, question: "Welches Element hat die höchste Dichte?", answers: ["Gold", "Platin", "Osmium", "Iridium"], correctAnswer: 2, difficulty: 9 },
  { id: 85, question: "Wer komponierte die 'Vier Jahreszeiten'?", answers: ["Bach", "Mozart", "Vivaldi", "Händel"], correctAnswer: 2, difficulty: 9 },
  { id: 86, question: "Wie heißt die kleinste Einheit der Zeit?", answers: ["Nanosekunde", "Pikosekunde", "Femtosekunde", "Attosekunde"], correctAnswer: 3, difficulty: 9 },
  { id: 87, question: "Welches ist das am weitesten von der Erde entfernte Objekt, das Menschen erreicht haben?", answers: ["Mond", "Mars", "Voyager 1", "ISS"], correctAnswer: 2, difficulty: 9 },
  { id: 88, question: "In welchem Jahrhundert lebte Leonardo da Vinci?", answers: ["14.", "15.", "16.", "17."], correctAnswer: 1, difficulty: 9 },
  { id: 89, question: "Wie viele Elemente sind im Periodensystem?", answers: ["98", "108", "118", "128"], correctAnswer: 2, difficulty: 9 },
  { id: 90, question: "Welches ist das älteste bekannte Schriftsystem?", answers: ["Hieroglyphen", "Keilschrift", "Chinesisch", "Sanskrit"], correctAnswer: 1, difficulty: 9 },

  // Difficulty 10 (Fragen 91-100)
  { id: 91, question: "Wie heißt der längste Name eines Ortes?", answers: ["Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch", "Taumatawhakatangihangakoauauotamateaturipukakapikimaungahoronukupokaiwhenuakitanatahu", "Chargoggagoggmanchauggagoggchaubunagungamaugg", "Tweebuffelsmeteenskootmorsdoodgeskietfontein"], correctAnswer: 1, difficulty: 10 },
  { id: 92, question: "Welches ist das einzige Land ohne Nationalhymne?", answers: ["Vatikan", "San Marino", "Zypern", "Keines"], correctAnswer: 2, difficulty: 10 },
  { id: 93, question: "Wie viele Meter ist ein Lichtjahr?", answers: ["9,46 Billionen km", "9,46 Millionen km", "9,46 Trillionen km", "946 Millionen km"], correctAnswer: 0, difficulty: 10 },
  { id: 94, question: "Wer war der erste Mensch im Weltraum?", answers: ["Armstrong", "Gagarin", "Glenn", "Shepard"], correctAnswer: 1, difficulty: 10 },
  { id: 95, question: "Welches ist die älteste noch existierende Universität?", answers: ["Oxford", "Cambridge", "Bologna", "Al-Qarawiyyin"], correctAnswer: 3, difficulty: 10 },
  { id: 96, question: "Wie viele Kalorien hat ein Gramm Fett?", answers: ["4", "7", "9", "11"], correctAnswer: 2, difficulty: 10 },
  { id: 97, question: "In welchem Jahr wurde die erste E-Mail verschickt?", answers: ["1969", "1971", "1973", "1975"], correctAnswer: 1, difficulty: 10 },
  { id: 98, question: "Welches ist das teuerste jemals verkaufte Gemälde?", answers: ["Mona Lisa", "Salvator Mundi", "Scream", "Die Kartenspieler"], correctAnswer: 1, difficulty: 10 },
  { id: 99, question: "Wie heißt die Konstante, die die Lichtgeschwindigkeit beschreibt?", answers: ["c", "e", "π", "G"], correctAnswer: 0, difficulty: 10 },
  { id: 100, question: "Welches ist das einzige Land, das zwei verschiedene Zeitzonen in einer Zeitzone hat?", answers: ["Russland", "China", "Indien", "USA"], correctAnswer: 1, difficulty: 10 },
];