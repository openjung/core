# Questionnaire translation record

## Scope and provenance

On 2026-09-15, Amp (AI coding/translation assistant) drafted 39 additional locales for the existing OpenJung English questionnaire adaptation: `ms de fr es ar he ru pt-br id vi th tr it pl nl hi bn fil uk sw cs ro hu sk el sv no da fi my km lo si ta am ha yo zu ig`.

Each locale supplies 32 titles and 64 answer endpoints (96 strings). Together with the unchanged `en zh ja ko zh-tw` text, the exported question bank contains 44 complete locales (4,224 strings). This is **source-text availability**, not evidence of translation accuracy, human review, cultural equivalence, reliability, or psychological validity. No native-speaker reviewer or language-specific validation study is documented for this change.

The drafting basis is the English text at [core revision f56d3e1](https://github.com/openjung/core/commit/f56d3e1efba004203cf2c526f86f8a7f3fff728b). The assistant also read the [OEJTS development page](https://openpsychometrics.org/tests/OJTS/development/) and [OEJTS 1.2 questionnaire and scoring instructions](https://openpsychometrics.org/tests/OJTS/development/OEJTS1.2.pdf), by Eric Jorgenson, March 3, 2015. This source check establishes the origin and wording of the instrument, not validation of OpenJung or the translations.

The questionnaire items and their adaptations, including these translations, are licensed under **[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)**, attributed to Eric Jorgenson / Open Psychometrics. The package's MIT code license does not replace the questionnaire's attribution, noncommercial and share-alike terms.

## What remains unchanged

- IDs, dimensions, the grouped `questions` order, ID-sorted presentation order, and quick subset.
- OpenJung's normalized answer direction: 1 = left, 5 = right; EI = E→I, SN = S→N, TF = F→T, JP = J→P. The source PDF reverses some pairs; these translations follow OpenJung's existing order, not the PDF's order.
- All existing five-language strings, scoring code, result formats and stored answers.
- Q12 intentionally follows the existing English **past / future** pair. The PDF instead says **present / future**. Resolving this existing adaptation difference requires separate editorial and compatibility work, not a silent change in a translation expansion.
- Titles are OpenJung prompts, not quotations from the PDF. The English idioms in Q6, Q10, Q18, Q22, Q24 and Q29 are translated for meaning. Q18's “fixing people” refers to helping people with their difficulties, not diagnosing or literally repairing people. Q27 does not imply anger.

`src/questionTranslations.ts` keys each triple by stable question ID, in the order `[title, leftTrait, rightTrait]`. `src/questions.ts` adds these strings to the same exported question objects at module initialization. There is no runtime translation service and no English substitution in the added data. `BilingualText` still requires `en`; other language entries remain optional for compatibility with existing consumers and their own partial content.

## Native-speaker review still needed

Every added locale needs independent bilingual review and respondent comprehension testing. The following are concrete priorities, **not a certification of the other phrases**. Check the titles together with both endpoints; review intensity, negation and social desirability without changing the scoring direction.

| Locale(s) | Questions / issue to resolve |
| --- | --- |
| All 39 | Q6 robot/mechanical-mind metaphor, Q10 emotional hurt rather than physical pain or shamelessness, Q18 helping people versus repairing objects, Q22 heart versus reason, Q24 overall picture versus details, Q29 vigorous leisure versus hard work. |
| `ms`, `id`, `fil`, `sw` | Q17 commitment versus keeping alternatives open; Q25 improvisation versus preparedness. For `fil`, check conversational loanwords and the register of “dumidiskarte.” For `sw`, check that “Usio na mpangilio” in Q9 captures a chaotic lifestyle without suggesting violence. |
| `my` | Q6 “စက်ကဲ့သို့” and Q28 “သီအိုရီများ”: understandable non-specialist terms? Check mixed conversational titles and formal answer endings, and Q10 negation. |
| `km` | Q6 “តក្កវិជ្ជា” and Q28 “ទ្រឹស្តី” reading level; Q17 strength of commitment; Q30 discomfort with emotions rather than a general bad mood. |
| `lo` | Q6 machine metaphor, Q25 spontaneous problem-solving without implying superior skill, Q26 compassion versus justice, Q28 theory terminology. Check word boundaries in narrow layouts. |
| `si` | Q6 robot/machine metaphor, Q24 “සමස්ත චිත්‍රය” as an overall understanding rather than a literal picture, Q28 theory terminology, and consistent self-report register. |
| `ta` | Q6 logical thinking versus a mechanical mind; Q8 school-exam terminology; Q25 improvisation without implying better ability; Q29 vigorous enjoyment without restricting it to celebrations. Check usage across Indian and Sri Lankan Tamil. |
| `am` | Q7 energy without implying physical strength; Q17 commitment phrasing; Q26 “ርኅራኄ” / “ፍትሕ”; Q28 “ንድፈ ሐሳብ”; Q30 discomfort, not absence of feelings. Check polite address and orthography. |
| `ha` | Q6 “mutum-mutumin inji” and Q28 “ra’ayoyin ka’ida” may need more familiar equivalents. Check generic masculine address, Q26 morality versus good behavior and Q31 performance versus demonstration. |
| `yo` | Verify tone marks and vowel underdots throughout. Check Q6 machine/robot wording, Q10 emotional hurt, Q26 compassion versus justice, Q28 “àbá ìmọ̀” for theory rather than a mere guess, and Q31 performance rather than play alone. |
| `zu` | Check noun agreement and register throughout; Q16 fitting in rather than conformity, Q26 compassion/justice, Q28 empirical/theoretical vocabulary and Q31 performing versus playing. |
| `ig` | Check standard-Igbo spelling/dialect and diacritics; Q3 boredom versus tiredness, Q15 parties versus eating/drinking alone, Q17 leaving options open, Q28 theory versus explanation, Q31 performance. |
| `ar`, `he`, `hi` | Review gendered address and whether an inclusive alternative preserves concise self-report wording. Arabic uses Modern Standard Arabic; Hebrew uses modern Hebrew. Check Q6 quoted metaphors and punctuation in RTL. |
| European locales | Check informal/formal address consistency, exam/essay terminology in Q8, idiomatic “thick-skinned” in Q10, and Q29 intensity without moral judgment. Norwegian is Bokmål (`no`); Portuguese is Brazilian (`pt-br`). |

Software tests check all fields directly (not via a fallback), exact original text/metadata preservation, and independently specified ID/dimension/answer-direction contracts. They cannot establish semantic equivalence. Host applications must also supply local scale labels and descriptions and test their own RTL rendering and keyboard behavior. OpenJung's existing “always / often / depends on situation” descriptions are application copy, not the PDF's “half and half” midpoint; this change does not redefine them.

Report wording corrections to [openjung/core issues](https://github.com/openjung/core/issues), identifying the locale, question ID, field, proposed wording and reason. Do not include personal answers, results or private session links. Record actual reviewer identity and scope only after that review occurs.
