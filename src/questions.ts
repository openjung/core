import type { QuestionPair, DimensionQuestions } from './types';

/**
 * OEJTS 1.2 - 32 Questions
 * Based on the Open Extended Jungian Type Scales 1.2
 * Source: https://openpsychometrics.org/tests/OEJTS/
 * Credit: Open Psychometrics (https://openpsychometrics.org/)
 *
 * Each question is a bipolar trait pair scored on a 1-5 scale
 * 1 = Strongly left trait, 5 = Strongly right trait
 */
export const questions: QuestionPair[] = [
  // JP dimension (Questions 1, 5, 9, 13, 17, 21, 25, 29)
  {
    id: 1,
    dimension: 'JP',
    title: { en: 'How do you track tasks?', zh: '你如何记录任务？', ja: 'タスクをどう管理する？', ko: '할 일을 어떻게 기록하나요?', 'zh-tw': '你如何記錄任務？' },
    leftTrait: { en: 'Makes lists', zh: '制定清单', ja: 'リストを作る', ko: '목록을 만든다', 'zh-tw': '制定清單' },
    rightTrait: { en: 'Relies on memory', zh: '依靠记忆', ja: '記憶に頼る', ko: '기억에 의존한다', 'zh-tw': '依靠記憶' },
  },
  {
    id: 5,
    dimension: 'JP',
    title: { en: 'How do you organize your space?', zh: '你如何整理空间？', ja: '身の回りの片づけは？', ko: '공간을 어떻게 정리하나요?', 'zh-tw': '你如何整理空間？' },
    leftTrait: { en: 'Keeps a clean room', zh: '保持房间整洁', ja: '部屋をきれいに保つ', ko: '방을 깨끗이 유지한다', 'zh-tw': '保持房間整潔' },
    rightTrait: { en: 'Just puts stuff wherever', zh: '随手放置东西', ja: '物はその辺に置きがち', ko: '물건을 아무데나 둔다', 'zh-tw': '隨手放置東西' },
  },
  {
    id: 9,
    dimension: 'JP',
    title: { en: 'How would you describe your lifestyle?', zh: '你如何形容自己的生活方式？', ja: 'あなたの生活スタイルは？', ko: '당신의 생활 방식은?', 'zh-tw': '你如何形容自己的生活方式？' },
    leftTrait: { en: 'Organized', zh: '有条理', ja: '整理整頓されている', ko: '체계적이다', 'zh-tw': '有條理' },
    rightTrait: { en: 'Chaotic', zh: '随性混乱', ja: '成り行きまかせ', ko: '혼란스럽다', 'zh-tw': '隨性混亂' },
  },
  {
    id: 13,
    dimension: 'JP',
    title: { en: 'When do you make plans?', zh: '你何时制定计划？', ja: 'いつ計画を立てる？', ko: '언제 계획을 세우나요?', 'zh-tw': '你何時制定計劃？' },
    leftTrait: { en: 'Plans far ahead', zh: '提前规划', ja: 'かなり前から計画する', ko: '미리 계획한다', 'zh-tw': '提前規劃' },
    rightTrait: { en: 'Plans at the last minute', zh: '最后一刻才计划', ja: '直前に計画する', ko: '마지막에 계획한다', 'zh-tw': '最後一刻才計劃' },
  },
  {
    id: 17,
    dimension: 'JP',
    title: { en: 'How do you approach decisions?', zh: '你如何做决定？', ja: '決めるときは？', ko: '결정을 어떻게 내리나요?', 'zh-tw': '你如何做決定？' },
    leftTrait: { en: 'Commits', zh: '做出承诺', ja: 'きっぱり決める', ko: '약속한다', 'zh-tw': '做出承諾' },
    rightTrait: { en: 'Keeps options open', zh: '保留选择', ja: '選択肢を残しておく', ko: '선택지를 열어둔다', 'zh-tw': '保留選擇' },
  },
  {
    id: 21,
    dimension: 'JP',
    title: { en: 'When do you complete tasks?', zh: '你何时完成任务？', ja: 'やるべきことは？', ko: '언제 일을 끝내나요?', 'zh-tw': '你何時完成任務？' },
    leftTrait: { en: 'Gets work done right away', zh: '立即完成工作', ja: 'すぐに片づける', ko: '일을 바로 끝낸다', 'zh-tw': '立即完成工作' },
    rightTrait: { en: 'Procrastinates', zh: '拖延', ja: '先延ばしにする', ko: '미룬다', 'zh-tw': '拖延' },
  },
  {
    id: 25,
    dimension: 'JP',
    title: { en: 'How do you handle new situations?', zh: '你如何应对新情况？', ja: '初めての状況では？', ko: '새로운 상황에 어떻게 대처하나요?', 'zh-tw': '你如何應對新情況？' },
    leftTrait: { en: 'Prepares', zh: '提前准备', ja: '準備する', ko: '준비한다', 'zh-tw': '提前準備' },
    rightTrait: { en: 'Improvises', zh: '即兴发挥', ja: 'その場で対応する', ko: '즉흥적으로 한다', 'zh-tw': '即興發揮' },
  },
  {
    id: 29,
    dimension: 'JP',
    title: { en: 'What drives you more?', zh: '什么更能驱动你？', ja: 'どちらに力を注ぐ？', ko: '무엇이 당신을 움직이나요?', 'zh-tw': '什麼更能驅動你？' },
    leftTrait: { en: 'Works hard', zh: '努力工作', ja: 'とことん頑張る', ko: '열심히 일한다', 'zh-tw': '努力工作' },
    rightTrait: { en: 'Plays hard', zh: '尽情玩乐', ja: '思い切り遊ぶ', ko: '열심히 논다', 'zh-tw': '盡情玩樂' },
  },

  // TF dimension (Questions 2, 6, 10, 14, 18, 22, 26, 30)
  {
    id: 2,
    dimension: 'TF',
    title: { en: 'How do you approach new information?', zh: '你如何看待新信息？', ja: '新しい情報に対しては？', ko: '새로운 정보를 어떻게 받아들이나요?', 'zh-tw': '你如何看待新資訊？' },
    leftTrait: { en: 'Wants to believe', zh: '愿意相信', ja: 'まず信じたい', ko: '믿고 싶어한다', 'zh-tw': '願意相信' },
    rightTrait: { en: 'Skeptical', zh: '持怀疑态度', ja: 'まず疑ってみる', ko: '회의적이다', 'zh-tw': '持懷疑態度' },
  },
  {
    id: 6,
    dimension: 'TF',
    title: { en: 'How do you view logical thinking?', zh: '你如何看待逻辑思维？', ja: '「ロボットみたい」と言われたら？', ko: '논리적 사고를 어떻게 생각하나요?', 'zh-tw': '你如何看待邏輯思維？' },
    leftTrait: { en: 'Thinks "robotic" is an insult', zh: '认为"像机器人"是侮辱', ja: '悪口だと感じる', ko: '"로봇 같다"는 말을 모욕으로 여긴다', 'zh-tw': '認為「像機器人」是侮辱' },
    rightTrait: { en: 'Strives to have a mechanical mind', zh: '追求机械般的思维', ja: 'むしろそうありたい', ko: '기계적인 사고를 추구한다', 'zh-tw': '追求機械般的思維' },
  },
  {
    id: 10,
    dimension: 'TF',
    title: { en: 'How do you handle criticism?', zh: '你如何应对批评？', ja: '批判されると？', ko: '비판을 어떻게 받아들이나요?', 'zh-tw': '你如何應對批評？' },
    leftTrait: { en: 'Easily hurt', zh: '容易受伤', ja: '傷つきやすい', ko: '쉽게 상처받는다', 'zh-tw': '容易受傷' },
    rightTrait: { en: 'Thick-skinned', zh: '脸皮厚', ja: '気にしない', ko: '둔감하다', 'zh-tw': '臉皮厚' },
  },
  {
    id: 14,
    dimension: 'TF',
    title: { en: 'What do you seek from others?', zh: '你希望从他人那里得到什么？', ja: '他者から何を求める？', ko: '다른 사람에게서 무엇을 원하나요?', 'zh-tw': '你希望從他人那裡得到什麼？' },
    leftTrait: { en: "Wants people's love", zh: '渴望他人的爱', ja: '人々の愛を求める', ko: '사람들의 사랑을 원한다', 'zh-tw': '渴望他人的愛' },
    rightTrait: { en: "Wants people's respect", zh: '渴望他人的尊重', ja: '人々の尊敬を求める', ko: '사람들의 존경을 원한다', 'zh-tw': '渴望他人的尊重' },
  },
  {
    id: 18,
    dimension: 'TF',
    title: { en: 'What would you like to be good at?', zh: '你想擅长什么？', ja: '得意になりたいのは？', ko: '무엇을 잘하고 싶나요?', 'zh-tw': '你想擅長什麼？' },
    leftTrait: { en: 'Wants to be good at fixing people', zh: '想擅长帮助他人', ja: '人の悩みを解きほぐすこと', ko: '사람을 돕는 것을 잘하고 싶다', 'zh-tw': '想擅長幫助他人' },
    rightTrait: { en: 'Wants to be good at fixing things', zh: '想擅长修理事物', ja: '壊れた物を直すこと', ko: '물건을 고치는 것을 잘하고 싶다', 'zh-tw': '想擅長修理事物' },
  },
  {
    id: 22,
    dimension: 'TF',
    title: { en: 'How do you make decisions?', zh: '你如何做决定？', ja: '決めるときの決め手は？', ko: '어떻게 결정을 내리나요?', 'zh-tw': '你如何做決定？' },
    leftTrait: { en: 'Follows the heart', zh: '跟随内心', ja: '気持ち', ko: '마음을 따른다', 'zh-tw': '跟隨內心' },
    rightTrait: { en: 'Follows the head', zh: '跟随理性', ja: '理屈', ko: '이성을 따른다', 'zh-tw': '跟隨理性' },
  },
  {
    id: 26,
    dimension: 'TF',
    title: { en: 'What is morality based on?', zh: '道德的基础是什么？', ja: '善悪の判断のよりどころは？', ko: '도덕의 기반은 무엇인가요?', 'zh-tw': '道德的基礎是什麼？' },
    leftTrait: { en: 'Bases morality on compassion', zh: '道德基于同情', ja: '思いやり', ko: '도덕은 동정심에 기반한다', 'zh-tw': '道德基於同情' },
    rightTrait: { en: 'Bases morality on justice', zh: '道德基于正义', ja: '公正さ', ko: '도덕은 정의에 기반한다', 'zh-tw': '道德基於正義' },
  },
  {
    id: 30,
    dimension: 'TF',
    title: { en: 'How do you relate to emotions?', zh: '你如何看待情感？', ja: '感情については？', ko: '감정을 어떻게 대하나요?', 'zh-tw': '你如何看待情感？' },
    leftTrait: { en: 'Values emotions', zh: '重视情感', ja: '感情を大切にする', ko: '감정을 중시한다', 'zh-tw': '重視情感' },
    rightTrait: { en: 'Uncomfortable with emotions', zh: '对情感感到不自在', ja: '感情を扱うのは苦手', ko: '감정이 불편하다', 'zh-tw': '對情感感到不自在' },
  },

  // EI dimension (Questions 3, 7, 11, 15, 19, 23, 27, 31)
  {
    id: 3,
    dimension: 'EI',
    title: { en: 'How do you feel about being alone?', zh: '你对独处有什么感受？', ja: '一人の時間は？', ko: '혼자 있는 것을 어떻게 느끼나요?', 'zh-tw': '你對獨處有什麼感受？' },
    leftTrait: { en: 'Bored by time alone', zh: '独处时感到无聊', ja: '退屈に感じる', ko: '혼자 있으면 지루하다', 'zh-tw': '獨處時感到無聊' },
    rightTrait: { en: 'Needs time alone', zh: '需要独处时间', ja: 'なくてはならない', ko: '혼자만의 시간이 필요하다', 'zh-tw': '需要獨處時間' },
  },
  {
    id: 7,
    dimension: 'EI',
    title: { en: 'What is your energy level like?', zh: '你的能量状态如何？', ja: '普段のテンションは？', ko: '당신의 에너지 수준은?', 'zh-tw': '你的能量狀態如何？' },
    leftTrait: { en: 'Energetic', zh: '精力充沛', ja: 'エネルギッシュ', ko: '활기차다', 'zh-tw': '精力充沛' },
    rightTrait: { en: 'Mellow', zh: '平静温和', ja: '穏やか', ko: '차분하다', 'zh-tw': '平靜溫和' },
  },
  {
    id: 11,
    dimension: 'EI',
    title: { en: 'How do you work best?', zh: '你在什么环境下工作最好？', ja: '力を発揮しやすいのは？', ko: '어떤 환경에서 가장 잘 일하나요?', 'zh-tw': '你在什麼環境下工作最好？' },
    leftTrait: { en: 'Works best in groups', zh: '在团队中表现最佳', ja: 'みんなで取り組むとき', ko: '팀에서 일할 때 최고다', 'zh-tw': '在團隊中表現最佳' },
    rightTrait: { en: 'Works best alone', zh: '独自工作表现最佳', ja: '一人で取り組むとき', ko: '혼자 일할 때 최고다', 'zh-tw': '獨自工作表現最佳' },
  },
  {
    id: 15,
    dimension: 'EI',
    title: { en: 'How do parties make you feel?', zh: '聚会让你感觉如何？', ja: '大人数の集まりでは？', ko: '파티에서 어떤 기분이 드나요?', 'zh-tw': '聚會讓你感覺如何？' },
    leftTrait: { en: 'Gets fired up by parties', zh: '因聚会而兴奋', ja: '元気が出る', ko: '파티에서 흥분한다', 'zh-tw': '因聚會而興奮' },
    rightTrait: { en: 'Gets worn out by parties', zh: '因聚会而疲惫', ja: '疲れてしまう', ko: '파티에서 지친다', 'zh-tw': '因聚會而疲憊' },
  },
  {
    id: 19,
    dimension: 'EI',
    title: { en: 'In conversations, do you...', zh: '在交谈中，你更倾向于...', ja: '会話では？', ko: '대화할 때 당신은...', 'zh-tw': '在交談中，你更傾向於...' },
    leftTrait: { en: 'Talks more', zh: '话比较多', ja: 'よく話す', ko: '말을 많이 한다', 'zh-tw': '話比較多' },
    rightTrait: { en: 'Listens more', zh: '更善于倾听', ja: 'よく聞く', ko: '듣는 편이다', 'zh-tw': '更善於傾聽' },
  },
  {
    id: 23,
    dimension: 'EI',
    title: { en: 'What do you prefer on weekends?', zh: '周末你更喜欢做什么？', ja: '週末は？', ko: '주말에 무엇을 하고 싶나요?', 'zh-tw': '週末你更喜歡做什麼？' },
    leftTrait: { en: 'Goes out on the town', zh: '喜欢外出活动', ja: '外に出かける', ko: '외출을 즐긴다', 'zh-tw': '喜歡外出活動' },
    rightTrait: { en: 'Stays at home', zh: '喜欢待在家里', ja: '家で過ごす', ko: '집에 있는 것을 좋아한다', 'zh-tw': '喜歡待在家裡' },
  },
  {
    id: 27,
    dimension: 'EI',
    title: { en: 'How loud is your natural voice?', zh: '你的自然音量如何？', ja: '声の大きさは？', ko: '당신의 자연스러운 목소리는?', 'zh-tw': '你的自然音量如何？' },
    leftTrait: { en: 'Yelling comes naturally', zh: '自然而然大声说话', ja: '大きな声が自然に出る', ko: '큰 소리가 자연스럽다', 'zh-tw': '自然而然大聲說話' },
    rightTrait: { en: 'Finds it difficult to yell loudly', zh: '很难大声喊叫', ja: '大声を出すのが苦手', ko: '큰 소리를 내기 어렵다', 'zh-tw': '很難大聲喊叫' },
  },
  {
    id: 31,
    dimension: 'EI',
    title: { en: 'How do you feel about being in the spotlight?', zh: '你对成为焦点有什么感受？', ja: '注目されるのは？', ko: '주목받는 것을 어떻게 느끼나요?', 'zh-tw': '你對成為焦點有什麼感受？' },
    leftTrait: { en: 'Likes to perform', zh: '喜欢表演', ja: '人前に立つのが好き', ko: '공연하는 것을 좋아한다', 'zh-tw': '喜歡表演' },
    rightTrait: { en: 'Avoids public speaking', zh: '避免公开演讲', ja: 'できれば避けたい', ko: '대중 앞에서 말하기를 피한다', 'zh-tw': '避免公開演講' },
  },

  // SN dimension (Questions 4, 8, 12, 16, 20, 24, 28, 32)
  {
    id: 4,
    dimension: 'SN',
    title: { en: 'How do you view the status quo?', zh: '你如何看待现状？', ja: '今の状況については？', ko: '현 상황을 어떻게 보나요?', 'zh-tw': '你如何看待現狀？' },
    leftTrait: { en: 'Accepts things as they are', zh: '接受事物的本来面目', ja: 'あるがままを受け入れる', ko: '있는 그대로 받아들인다', 'zh-tw': '接受事物的本來面目' },
    rightTrait: { en: 'Unsatisfied with the way things are', zh: '对现状不满足', ja: '今のままでは物足りない', ko: '현 상황에 만족하지 않는다', 'zh-tw': '對現狀不滿足' },
  },
  {
    id: 8,
    dimension: 'SN',
    title: { en: 'What type of test do you prefer?', zh: '你喜欢什么类型的考试？', ja: '好きな試験形式は？', ko: '어떤 유형의 시험을 선호하나요?', 'zh-tw': '你喜歡什麼類型的考試？' },
    leftTrait: { en: 'Prefers multiple choice test', zh: '喜欢选择题', ja: '選択問題', ko: '객관식을 선호한다', 'zh-tw': '喜歡選擇題' },
    rightTrait: { en: 'Prefers essay answers', zh: '喜欢论述题', ja: '記述問題', ko: '서술형을 선호한다', 'zh-tw': '喜歡論述題' },
  },
  {
    id: 12,
    dimension: 'SN',
    title: { en: 'Where is your focus in time?', zh: '你的时间焦点在哪里？', ja: '意識が向くのは？', ko: '시간의 초점은 어디에 있나요?', 'zh-tw': '你的時間焦點在哪裡？' },
    leftTrait: { en: 'Focused on the past', zh: '关注过去', ja: '過去のこと', ko: '과거에 집중한다', 'zh-tw': '關注過去' },
    rightTrait: { en: 'Focused on the future', zh: '关注未来', ja: '未来のこと', ko: '미래에 집중한다', 'zh-tw': '關注未來' },
  },
  {
    id: 16,
    dimension: 'SN',
    title: { en: 'In a group, do you tend to...', zh: '在群体中，你倾向于...', ja: 'グループの中では？', ko: '그룹에서 당신은...', 'zh-tw': '在群體中，你傾向於...' },
    leftTrait: { en: 'Fits in', zh: '融入群体', ja: '周りに溶け込む', ko: '어울린다', 'zh-tw': '融入群體' },
    rightTrait: { en: 'Stands out', zh: '与众不同', ja: '目立つほう', ko: '눈에 띈다', 'zh-tw': '與眾不同' },
  },
  {
    id: 20,
    dimension: 'SN',
    title: { en: 'When telling a story, do you...', zh: '讲故事时，你会...', ja: '出来事を話すときは？', ko: '이야기할 때 당신은...', 'zh-tw': '講故事時，你會...' },
    leftTrait: { en: 'Describes what happened', zh: '描述发生了什么', ja: '何が起きたかを話す', ko: '무슨 일이 있었는지 설명한다', 'zh-tw': '描述發生了什麼' },
    rightTrait: { en: 'Describes what it meant', zh: '描述这意味着什么', ja: 'それにどんな意味があったかを話す', ko: '그것이 무엇을 의미하는지 설명한다', 'zh-tw': '描述這意味著什麼' },
  },
  {
    id: 24,
    dimension: 'SN',
    title: { en: 'When learning something new, what do you want?', zh: '学习新事物时，你想要什么？', ja: '新しいことを学ぶときは？', ko: '새로운 것을 배울 때 무엇을 원하나요?', 'zh-tw': '學習新事物時，你想要什麼？' },
    leftTrait: { en: 'Wants the details', zh: '想要细节', ja: 'まず細かい点を知りたい', ko: '세부사항을 원한다', 'zh-tw': '想要細節' },
    rightTrait: { en: 'Wants the big picture', zh: '想要大局观', ja: 'まず全体像をつかみたい', ko: '큰 그림을 원한다', 'zh-tw': '想要大局觀' },
  },
  {
    id: 28,
    dimension: 'SN',
    title: { en: 'How do you approach knowledge?', zh: '你如何获取知识？', ja: '知識の身につけ方は？', ko: '지식에 어떻게 접근하나요?', 'zh-tw': '你如何獲取知識？' },
    leftTrait: { en: 'Empirical', zh: '经验主义', ja: '経験や実例から', ko: '경험주의적이다', 'zh-tw': '經驗主義' },
    rightTrait: { en: 'Theoretical', zh: '理论主义', ja: '理論や原理から', ko: '이론적이다', 'zh-tw': '理論主義' },
  },
  {
    id: 32,
    dimension: 'SN',
    title: { en: 'What questions interest you most?', zh: '什么问题最让你感兴趣？', ja: '気になるのは？', ko: '어떤 질문에 가장 관심이 있나요?', 'zh-tw': '什麼問題最讓你感興趣？' },
    leftTrait: { en: 'Likes to know "who/what/when"', zh: '想知道"谁/什么/何时"', ja: '「誰が・何を・いつ」', ko: '"누가/무엇을/언제"를 알고 싶다', 'zh-tw': '想知道「誰/什麼/何時」' },
    rightTrait: { en: 'Likes to know "why"', zh: '想知道"为什么"', ja: '「なぜ」', ko: '"왜"를 알고 싶다', 'zh-tw': '想知道「為什麼」' },
  },
];

// Question IDs grouped by dimension for scoring
export const dimensionQuestions: DimensionQuestions = {
  EI: [3, 7, 11, 15, 19, 23, 27, 31],
  SN: [4, 8, 12, 16, 20, 24, 28, 32],
  TF: [2, 6, 10, 14, 18, 22, 26, 30],
  JP: [1, 5, 9, 13, 17, 21, 25, 29],
} as const;

// Get questions sorted by ID for test presentation
export const sortedQuestions = [...questions].sort((a, b) => a.id - b.id);

// Total number of questions
export const TOTAL_QUESTIONS = 32;

// Questions per dimension
export const QUESTIONS_PER_DIMENSION = 8;

/**
 * Quick Test Mode - 8 most discriminating questions (2 per dimension)
 * Selected for clarity and strong differentiation between types
 */
export const quickTestQuestionIds: Record<string, number[]> = {
  EI: [3, 15],   // "Needs time alone" & "Gets worn out by parties" - clear E/I indicators
  SN: [24, 32],  // "Details vs big picture" & "who/what/when vs why" - clear S/N indicators
  TF: [22, 14],  // "Heart vs head" & "love vs respect" - clear T/F indicators
  JP: [9, 13],   // "Organized vs chaotic" & "plans ahead vs last minute" - clear J/P indicators
} as const;

// Flat list of quick test question IDs (sorted by ID for consistent presentation)
export const quickTestQuestions = Object.values(quickTestQuestionIds).flat().sort((a, b) => a - b);

// Quick test totals
export const QUICK_TEST_TOTAL = 8;
export const QUICK_TEST_PER_DIMENSION = 2;
